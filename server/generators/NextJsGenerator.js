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
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'auth'));
            addDeps({
                "next-auth": "^4.24.5",
                "bcryptjs": "^2.4.3" // Optional if doing credentials with hash
            });
            // We might need to inject SessionProvider into layout, handled via template overlay or placeholders ?
            // For simplicity, the auth feature template will contain an "app/layout.tsx" that OVERWRITES the base one 
            // OR we use the strategy of replacing the layout.
            // Let's assume the auth feature template has a layout that includes the provider.
            // *Better approach*: Base layout is simple. Auth layout wraps it.
            // To ensure safe merging, we'll rely on file overwrite for 'app/layout.tsx' if 'auth' feature provides one.
        }

        // b. Tailwind
        if (this.features.includes('tailwind')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'tailwind'));
            addDevDeps({
                "tailwindcss": "^3.3.0",
                "postcss": "^8.4.31",
                "autoprefixer": "^10.4.16"
            });
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
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'env'));
        }

        // f. GitHub
        if (this.features.includes('github')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'github'));
        }

        // g. Readme
        if (this.features.includes('readme')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'readme'));
        }

        // h. Linting
        if (this.features.includes('linting')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'linting'));
            addDevDeps({
                "eslint": "^8.0.0",
                "eslint-config-next": "14.0.0", // or match version
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

module.exports = NextJsGenerator;
