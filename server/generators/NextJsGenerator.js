const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class NextJsGenerator extends BaseGenerator {
    constructor(args) {
        super(args);
        this.templatesPath = path.join(__dirname, '..', 'templates', 'nextjs');
    }

    async generate() {
        console.log(`Generating Next.js project: ${this.projectName}`);
        console.log(`Detected features:`, this.features);

        // 1. Create structure and copy base template
        this.createTempDir();
        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features
        let dependencies = {};
        let devDependencies = {};
        let scripts = {};

        const addDeps = (deps) => Object.assign(dependencies, deps);
        const addDevDeps = (deps) => Object.assign(devDependencies, deps);
        const addScripts = (s) => Object.assign(scripts, s);

        // a. Auth (NextAuth)
        if (this.features.includes('auth')) {
            // Auth is now included in the Next.js base template.
            // Keeping the feature flag for backward compatibility with existing UI selections.
        }

        // b. Tailwind
        if (this.features.includes('tailwind')) {
            // Tailwind is now included in the Next.js base template.
            // Keeping the feature flag for backward compatibility.
        }

        // c. Docker
        if (this.features.includes('docker')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'docker'));
            // Next.js output standalone for docker is common
        }

        // d. Deployment
        if (this.features.includes('deployment')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'deployment'));
        }

        // e. Env
        if (this.features.includes('env')) {
            // .env.example is now included in the Next.js base template.
            // Keeping the feature flag for backward compatibility.
        }

        // f. GitHub
        if (this.features.includes('github')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'github'));
        }

        // g. Readme
        if (this.features.includes('readme')) {
            // README.md is now included in the Next.js base template.
            // Keeping the feature flag for backward compatibility.
        }

        // h. Linting
        if (this.features.includes('linting')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'linting'));
            addDevDeps({
                "eslint": "^9.0.0",
                "eslint-config-next": "16.1.6",
                "prettier": "^3.1.0",
                "eslint-config-prettier": "^9.0.0"
            });
            addScripts({
                "lint": "next lint",
                "format": "prettier --write ."
            });
        }

        // 3. Update package.json
        this.updatePackageJson('package.json', { dependencies, devDependencies, scripts });

        // 4. Replace Placeholders
        const replacements = {
            '__PROJECT_NAME__': this.projectInfo.name || 'nextjs-app',
            '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A Next.js Project',
            '__AUTHOR__': this.projectInfo.author || 'DevStarter User'
        };

        // README exists in the base template, so always replace __FEATURES_LIST__.
        // Include built-in core features plus any selected optional features.
        const includedFeatures = Array.from(
            new Set([
                'tailwind',
                'auth',
                'env',
                'health',
                'readme',
                ...(this.features || [])
            ])
        );
        const featureList = includedFeatures.filter(Boolean).map(f => `- [x] ${f}`).join('\\n');
        replacements['__FEATURES_LIST__'] = featureList;

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

module.exports = NextJsGenerator;
