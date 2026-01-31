const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class FlaskGenerator extends BaseGenerator {
    constructor(args) {
        super(args);
        this.templatesPath = path.join(__dirname, '..', 'templates', 'flask');
    }

    async generate() {
        console.log(`Generating Flask project: ${this.projectName}`);

        // 1. Create structure and copy base template
        this.createTempDir();
        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features & Requirements
        let requirements = new Set();
        this.addRequirementsFromFile(path.join(this.templatesPath, 'base', 'requirements.txt'), requirements);

        // a. Auth
        if (this.features.includes('auth')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'auth'));
            this.addRequirementsFromFile(path.join(this.templatesPath, 'features', 'auth', 'requirements.txt'), requirements);
        }

        // b. Docker
        if (this.features.includes('docker')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'docker'));
        }

        // c. Env
        if (this.features.includes('env')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'env'));
        }

        // d. Github
        if (this.features.includes('github')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'github'));
        }

        // e. Deployment
        if (this.features.includes('deployment')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'deployment'));
        }

        // f. Linting
        if (this.features.includes('linting')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'linting'));
            this.addRequirementsFromFile(path.join(this.templatesPath, 'features', 'linting', 'requirements.txt'), requirements);
        }

        // g. Readme
        if (this.features.includes('readme')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'readme'));
        }

        // h. Tailwind
        if (this.features.includes('tailwind')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'tailwind'));
        }

        // 3. Write merged requirements.txt
        const reqContent = Array.from(requirements).join('\n');
        fs.writeFileSync(path.join(this.projectPath, 'requirements.txt'), reqContent);

        // 4. Replace Placeholders
        const replacements = {
            '__PROJECT_NAME__': this.projectInfo.name || 'flask-project',
            '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A Flask Project',
        };

        if (this.features.includes('readme')) {
            const featureList = this.features.map(f => `- [x] ${f}`).join('\\n');
            replacements['__FEATURES_LIST__'] = featureList;
        }

        this.replacePlaceholders('', replacements);

        // 5. Zip and Return
        return await this.zipAndReturn();
    }

    addRequirementsFromFile(filePath, requirementsSet) {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            lines.forEach(line => {
                const trimmed = line.trim();
                // Basic cleanup, ignore comments and empty lines
                if (trimmed && !trimmed.startsWith('#')) {
                    requirementsSet.add(trimmed);
                }
            });
        }
    }
}

module.exports = FlaskGenerator;
