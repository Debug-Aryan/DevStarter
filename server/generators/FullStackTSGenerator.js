const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class FullStackTSGenerator extends BaseGenerator {
    constructor(args) {
        super(args);
        this.templatesPath = path.join(__dirname, '..', 'templates', 'full-stack-ts');
    }

    async generate() {
        console.log(`Generating Full-Stack TS project: ${this.projectName}`);
        console.log(`Detected features:`, this.features);

        // 1. Create structure and copy base template
        this.createTempDir();
        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features
        // We'll track package.json updates
        let serverDeps = {};
        let clientDeps = {};
        let clientDevDeps = {};
        let serverDevDeps = {};
        let serverScripts = {};
        let clientScripts = {};

        // Helper to merge dependencies
        const addServerDeps = (deps) => Object.assign(serverDeps, deps);
        const addServerDevDeps = (deps) => Object.assign(serverDevDeps, deps);
        const addClientDeps = (deps) => Object.assign(clientDeps, deps);
        const addClientDevDeps = (deps) => Object.assign(clientDevDeps, deps);
        const addServerScripts = (scripts) => Object.assign(serverScripts, scripts);
        const addClientScripts = (scripts) => Object.assign(clientScripts, scripts);

        // a. Auth
        if (this.features.includes('auth')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'auth'));
            addServerDeps({
                "bcryptjs": "^2.4.3",
                "jsonwebtoken": "^9.0.2"
            });
            addServerDevDeps({
                "@types/bcryptjs": "^2.4.6",
                "@types/jsonwebtoken": "^9.0.5"
            });
            addClientDeps({
                "axios": "^1.6.2" // Assuming auth template uses axios
            });
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
                "eslint": "^8.55.0",
                "eslint-plugin-react": "^7.33.2",
                "eslint-plugin-react-hooks": "^4.6.0",
                "eslint-plugin-react-refresh": "^0.4.5",
                "prettier": "^3.1.0",
                "@typescript-eslint/eslint-plugin": "^6.13.2",
                "@typescript-eslint/parser": "^6.13.2"
            });
            addServerDevDeps({
                "eslint": "^8.55.0",
                "prettier": "^3.1.0",
                "@typescript-eslint/eslint-plugin": "^6.13.2",
                "@typescript-eslint/parser": "^6.13.2"
            });
            // Add scripts
            addClientScripts({ "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0", "format": "prettier --write ." });
            addServerScripts({ "lint": "eslint . --ext ts", "format": "prettier --write ." });
        }

        // h. Tailwind
        if (this.features.includes('tailwind')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'tailwind'));
            addClientDevDeps({
                "tailwindcss": "^3.3.6",
                "postcss": "^8.4.32",
                "autoprefixer": "^10.4.16"
            });
        }

        // 3. Update package.jsons with gathered deps
        this.updatePackageJson('server/package.json', { dependencies: serverDeps, devDependencies: serverDevDeps, scripts: serverScripts });
        this.updatePackageJson('client/package.json', { dependencies: clientDeps, devDependencies: clientDevDeps, scripts: clientScripts });

        // 4. Replace Placeholders (Global)
        const replacements = {
            '__PROJECT_NAME__': this.projectInfo.name || 'devstarter-project',
            '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A Full-Stack TypeScript Project',
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

module.exports = FullStackTSGenerator;
