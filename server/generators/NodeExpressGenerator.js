const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class NodeExpressGenerator extends BaseGenerator {
    constructor(args) {
        super(args);
        this.templatesPath = path.join(__dirname, '..', 'templates', 'node-express');
    }

    async generate() {
        console.log(`Generating Node.js + Express project: ${this.projectName}`);
        console.log(`Detected features:`, this.features);

        // 1. Create structure and copy base template
        this.createTempDir();
        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features
        let serverDeps = {};
        let serverDevDeps = {};
        let serverScripts = {};

        const addServerDeps = (deps) => Object.assign(serverDeps, deps);
        const addServerDevDeps = (deps) => Object.assign(serverDevDeps, deps);
        const addServerScripts = (scripts) => Object.assign(serverScripts, scripts);

        // a. Auth
        if (this.features.includes('auth')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'auth'));
            addServerDeps({
                "bcryptjs": "^2.4.3",
                "jsonwebtoken": "^9.0.2"
            });
        }

        // b. Docker
        if (this.features.includes('docker')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'docker'));
        }

        // c. Github
        if (this.features.includes('github')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'github'));
        }

        // d. Env
        if (this.features.includes('env')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'env'));
        }

        // e. Deployment
        if (this.features.includes('deployment')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'deployment'));
        }

        // f. Readme
        if (this.features.includes('readme')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'readme'));
        }

        // g. Linting
        if (this.features.includes('linting')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'linting'));
            addServerDevDeps({
                "eslint": "^8.55.0",
                "eslint-config-airbnb-base": "^15.0.0",
                "eslint-plugin-import": "^2.29.0",
                "prettier": "^3.1.0"
            });
            addServerScripts({
                "lint": "eslint .",
                "format": "prettier --write ."
            });
        }

        // 3. Update package.json
        this.updatePackageJson('server/package.json', { dependencies: serverDeps, devDependencies: serverDevDeps, scripts: serverScripts });

        // 4. Replace Placeholders
        const replacements = {
            '__PROJECT_NAME__': this.projectInfo.name || 'express-project',
            '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A Node.js + Express Project',
            '__AUTHOR__': this.projectInfo.author || 'DevStarter User',
        };

        if (this.features.includes('readme')) {
            const featureList = this.features.map(f => `- [x] ${f}`).join('\\n');
            replacements['__FEATURES_LIST__'] = featureList;
        }

        this.replacePlaceholders('', replacements);

        // 5. Zip and Return
        return await this.zipAndReturn();
    }

    updatePackageJson(relativePath, { dependencies = {}, devDependencies = {}, scripts = {} }) {
        const fullPath = path.join(this.projectPath, relativePath);
        if (fs.existsSync(fullPath)) {
            const pkg = fs.readJsonSync(fullPath);
            pkg.dependencies = { ...pkg.dependencies, ...dependencies };
            pkg.devDependencies = { ...pkg.devDependencies, ...devDependencies };
            pkg.scripts = { ...pkg.scripts, ...scripts };
            fs.writeJsonSync(fullPath, pkg, { spaces: 2 });
        }
    }
}

module.exports = NodeExpressGenerator;
