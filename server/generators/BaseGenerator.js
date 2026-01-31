const fs = require('fs-extra');
const path = require('path');
const { zipProject } = require('../utils/zipProject');

class BaseGenerator {
    constructor({ stack, features, projectInfo, tempDir }) {
        this.stack = stack;

        // Handle features if it's an array or an object (map of feature->boolean)
        if (Array.isArray(features)) {
            this.features = features;
        } else if (typeof features === 'object' && features !== null) {
            this.features = Object.keys(features).filter(key => features[key] === true);
        } else {
            this.features = [];
            console.warn('Features input was not recognized as array or object:', features);
        }

        this.projectInfo = projectInfo || {};
        this.projectName = this.projectInfo.name || 'my-app';
        this.tempDir = tempDir;
        // The root content of the project will be inside tempDir/projectName
        this.projectPath = path.join(this.tempDir, this.projectName);
    }

    // Abstract method
    async generate() {
        throw new Error('Method "generate" must be implemented');
    }

    createTempDir() {
        fs.ensureDirSync(this.projectPath);
    }

    // Copies a folder recursively from templates to the project temp dir
    copyTemplateFolder(templatePath, targetPath) {
        const dest = targetPath ? path.join(this.projectPath, targetPath) : this.projectPath;
        if (fs.existsSync(templatePath)) {
            fs.copySync(templatePath, dest);
        } else {
            console.warn(`Template path not found: ${templatePath}`);
        }
    }

    // Merges a feature template (usually just overlaying files)
    mergeFeatureTemplate(featureName, featureTemplatePath) {
        // Can be overridden if specific merge logic is needed (e.g. JSON merge)
        // For now, default is copy/overwrite
        this.copyTemplateFolder(featureTemplatePath);
    }

    replacePlaceholders(dirPath, replacements) {
        const fullPath = dirPath ? path.join(this.projectPath, dirPath) : this.projectPath;

        if (!fs.existsSync(fullPath)) return;

        const files = fs.readdirSync(fullPath);

        files.forEach(file => {
            const filePath = path.join(fullPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                this.replacePlaceholders(path.join(dirPath || '', file), replacements);
            } else {
                let content = fs.readFileSync(filePath, 'utf8');
                let changed = false;

                // Only replace if content is text (heuristic or just try/catch)
                // For safety, let's assume all templates are text or well-known binary extensions skipped
                // But for now, just replace.

                for (const [key, value] of Object.entries(replacements)) {
                    const regex = new RegExp(key, 'g');
                    if (content.match(regex)) {
                        content = content.replace(regex, value);
                        changed = true;
                    }
                }

                if (changed) {
                    fs.writeFileSync(filePath, content, 'utf8');
                }
            }
        });
    }

    async zipAndReturn() {
        // Zip the specific project folder, not the temp container
        return await zipProject(this.projectPath);
    }

    // Helper to read/write JSON for package.json merging if needed
    readJson(filePath) {
        return fs.readJsonSync(path.join(this.projectPath, filePath));
    }

    writeJson(filePath, data) {
        fs.writeJsonSync(path.join(this.projectPath, filePath), data, { spaces: 2 });
    }

    getProjectStats() {
        let fileCount = 0;
        let totalSize = 0;

        const countRecursive = (dir) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    countRecursive(filePath);
                } else {
                    fileCount++;
                    totalSize += stats.size;
                }
            }
        };

        if (fs.existsSync(this.projectPath)) {
            countRecursive(this.projectPath);
        }

        return { fileCount, totalSize };
    }
}

module.exports = BaseGenerator;
