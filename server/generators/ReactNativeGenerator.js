const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class ReactNativeGenerator extends BaseGenerator {
    constructor(args) {
        super(args);
        this.templatesPath = path.join(__dirname, '..', 'templates', 'react-native');
    }

    async generate() {
        console.log(`Generating React Native project: ${this.projectName}`);
        console.log(`Detected features:`, this.features);

        // 1. Create structure and copy base template
        this.createTempDir();
        // React Native stack is client-only (for now), so we copy base/client to root or keeping 'client' folder?
        // The requirement says "stack is client-only, no server folder. Everything is in base/client".
        // Usually standard RN projects have package.json at root.
        // Let's copy base/client CONTENTS to the project root. 
        // Wait, other stacks usually have 'client' and 'server' folders.
        // "Everything is in base/client."
        // If we copy base/client to projectRoot/client, then the zip will have a top level folder 'client'.
        // If we copy base/client to projectRoot, then the zip will have RN files at top level.
        // The user said: "base/client (React Native app)... Notes: This stack is client-only, no server folder. Everything is in base/client."
        // Given the structure of other stacks, it might be consistent to have a 'client' folder or just root.
        // However, if I look at 'mern', it has 'client' and 'server'.
        // If the user wants a zip with the app, maybe they want the root of the zip to be the app?
        // But for consistency with "DevStarter" which usually generates a root folder containing the project...
        // Let's assume we place it in a 'client' folder if it keeps consistency, OR if it's a standalone client app, maybe root is better.
        // Requirement says: "Template folder structure... base/client".
        // "Feature templates... auth/ ...".
        // Let's look at `MernGenerator`. It copies `client` and `server`.
        // If I only have client, I should probably still put it in `client` folder OR just put it in root.
        // But if I put it in root, I shouldn't call it 'client' in the zip.
        // However, usually these generators produce a folder with the project name.
        // Let's stick to having a `client` folder to be safe and consistent with the structure of templates, 
        // unless I see that I should unzip `base/client` to the root `tempDir/projectName`.
        // Let's try to verify what BaseGenerator does or what other single-side generators do (if any).
        // Reviewing `MernGenerator`: `this.copyTemplateFolder(path.join(this.templatesPath, 'base'));`
        // This implies it copies `base` content which contains `client` and `server` folders.
        // So if `react-native/base` contains `client`, and I copy `base`, I will get a `client` folder in my project. 
        // That seems correct and consistent.

        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features
        let clientDeps = {};
        let clientDevDeps = {};
        let clientScripts = {};

        const addClientDeps = (deps) => Object.assign(clientDeps, deps);
        const addClientDevDeps = (deps) => Object.assign(clientDevDeps, deps);
        const addClientScripts = (scripts) => Object.assign(clientScripts, scripts);

        // a. Auth
        if (this.features.includes('auth')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'auth'));
            // Add dependencies if any (none specified in prompt, but maybe navigation?)
            // Prompt says: "Update RootNavigator.js to include Login and Register screens... Use existing feature templates... adapt to JS"
        }

        // b. Docker
        if (this.features.includes('docker')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'docker'));
        }

        // c. GitHub
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
            addClientDevDeps({
                "eslint": "^8.50.0",
                "eslint-config-universe": "^12.0.0",
                "prettier": "^3.0.0"
            });
            addClientScripts({
                "lint": "eslint .",
                "format": "prettier --write ."
            });
        }

        // h. Tailwind
        if (this.features.includes('tailwind')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'tailwind'));
            addClientDeps({
                "nativewind": "^2.0.11",
                "tailwindcss": "^3.3.2"
            });
        }

        // 3. Update package.json
        // Since everything is in `client`, we update `client/package.json`
        this.updatePackageJson('client/package.json', {
            dependencies: clientDeps,
            devDependencies: clientDevDeps,
            scripts: clientScripts
        });

        // 4. Replace Placeholders
        const replacements = {
            '__PROJECT_NAME__': this.projectInfo.name || 'devstarter-project',
            '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A React Native Project',
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

module.exports = ReactNativeGenerator;
