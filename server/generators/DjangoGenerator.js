const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class DjangoGenerator extends BaseGenerator {
    constructor(args) {
        super(args);
        this.templatesPath = path.join(__dirname, '..', 'templates', 'django');
    }

    async generate() {
        console.log(`Generating Django project: ${this.projectName}`);

        // 1. Create structure and copy base template
        this.createTempDir();
        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features & Requirements
        // We will collect all requirements and write them at the end to avoid overwriting
        let requirements = new Set();

        // Read base requirements
        this.addRequirementsFromFile(path.join(this.templatesPath, 'base', 'requirements.txt'), requirements);

        // a. Auth
        if (this.features.includes('auth')) {
            //  // Auth is now included in the Django base template.
            // Keeping the feature flag for backward compatibility with existing UI selections.    
        }

        // b. Docker
        if (this.features.includes('docker')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'docker'));
            this.addRequirementsFromFile(path.join(this.templatesPath, 'features', 'docker', 'requirements.txt'), requirements);
        }

        // c. Env
        if (this.features.includes('env')) {
            // Env is now included in the Django base template.
            // Keeping the feature flag for backward compatibility with existing UI selections.
        }

        // d. Github
        if (this.features.includes('github')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'github'));
        }

        // e. Linting
        if (this.features.includes('linting')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'linting'));
            this.addRequirementsFromFile(path.join(this.templatesPath, 'features', 'linting', 'requirements.txt'), requirements);
        }

        // f. Readme
        if (this.features.includes('readme')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'readme'));
        }

        // g. Deployment
        if (this.features.includes('deployment')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'deployment'));
        }

        // h. Tailwind
        if (this.features.includes('tailwind')) {
            // Tailwind is now included in the Django base template.
            // Keeping the feature flag for backward compatibility with existing UI selections.
        }

        // 3. Write merged requirements.txt
        const reqContent = Array.from(requirements).join('\n');
        fs.writeFileSync(path.join(this.projectPath, 'requirements.txt'), reqContent);

        // 4. Replace Placeholders
        const replacements = {
            '__PROJECT_NAME__': this.projectInfo.name || 'django-project',
            '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A Django Project',
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

    addRequirementsFromFile(filePath, requirementsSet) {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    requirementsSet.add(trimmed);
                }
            });
        }
    }
}

module.exports = DjangoGenerator;
