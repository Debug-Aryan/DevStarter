const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class SpringBootGenerator extends BaseGenerator {
    constructor(args) {
        super(args);
        this.templatesPath = path.join(__dirname, '..', 'templates', 'spring-boot');
        this.pomDependencies = '';
        this.pomPlugins = '';
        this.properties = '';
    }

    copyFeatureFolder(featureName, folderName = featureName) {
        const featurePath = path.join(this.templatesPath, 'features', folderName);
        if (fs.existsSync(featurePath)) {
            this.copyTemplateFolder(featurePath);
            return true;
        }

        // Feature selected in UI but no corresponding template exists.
        // Skipping to avoid generator crashes.
        return false;
    }

    async generate() {
        console.log(`Generating Spring Boot project: ${this.projectName}`);
        console.log(`Detected features:`, this.features);

        // 1. Create structure and copy base template
        this.createTempDir();
        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features

        // a. Auth
        if (this.features.includes('auth')) {
             // Auth is now included in the Spring Boot base template.
            // Keeping the feature flag for backward compatibility with existing UI selections.
        }

        // b. Docker
        if (this.features.includes('docker')) {
            // Docker support is provided via the docker feature templates.
            // If templates are missing, skip (backward compatibility / no crash).
            this.copyFeatureFolder('docker');
        }

        // c. Github
        if (this.features.includes('github')) {
            this.copyFeatureFolder('github');
        }

        // d. Env
        if (this.features.includes('env')) {
            // Base template already reads environment variables from application.properties.
            // Keep this feature for providing extra env files (like .env.example) if present.
            this.copyFeatureFolder('env');
        }

        // e. Deployment
        if (this.features.includes('deployment')) {
            this.copyFeatureFolder('deployment');
        }

        // f. Linting
        if (this.features.includes('linting')) {
            this.copyFeatureFolder('linting');

            this.injectPomPlugins(`
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-checkstyle-plugin</artifactId>
                <version>3.3.1</version>
                <configuration>
                    <configLocation>checkstyle.xml</configLocation>
                    <consoleOutput>true</consoleOutput>
                    <failsOnError>true</failsOnError>
                    <linkXRef>false</linkXRef>
                </configuration>
                <executions>
                    <execution>
                        <id>validate</id>
                        <phase>validate</phase>
                        <goals>
                            <goal>check</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            `);
        }

        // g. Readme
        if (this.features.includes('readme')) {
            // README is provided via feature templates.
            // If templates are missing, skip to avoid generator crashes.
            this.copyFeatureFolder('readme');
        }

        // h. Tailwind
        if (this.features.includes('tailwind')) {
            // Tailwind is primarily a frontend concern. For a Spring Boot backend, this feature may not be applicable.
        }

        // 3. Finalize File Changes (Single Write Operation)
        this.finalizeFiles();

        // 4. Replace Placeholders
        const replacements = {
            '__PROJECT_NAME__': this.projectInfo.name || 'devstarter-app',
            '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A Spring Boot Application',
        };

        if (this.features.includes('readme')) {
            const featureList = this.features.map(f => `- [x] ${f}`).join('\\n');
            replacements['__FEATURES_LIST__'] = featureList;
        }

        this.replacePlaceholders('', replacements);

        // Safety delay to ensure file system sync
        await new Promise(resolve => setTimeout(resolve, 200));

        // 5. Zip and Return
        return await this.zipAndReturn();
    }

    injectPomDependencies(dependencyString) {
        // Strip out tags, just keep inside content
        let innerContent = dependencyString.replace(/<\/?dependencies>/g, '').trim();
        this.pomDependencies += (innerContent + '\n');
    }

    injectPomPlugins(pluginString) {
        this.pomPlugins += (pluginString + '\n');
    }

    appendProperties(properties) {
        this.properties += ('\n' + properties);
    }

    finalizeFiles() {
        // 1. Process POM
        const pomPath = path.join(this.projectPath, 'pom.xml');
        if (fs.existsSync(pomPath)) {
            let content = fs.readFileSync(pomPath, 'utf8');

            if (this.pomDependencies) {
                content = content.replace(
                    '<!-- DEPENDENCIES_PLACEHOLDER -->',
                    this.pomDependencies
                );
            }
            // Logic to clear placeholder in all cases
            content = content.replace('<!-- DEPENDENCIES_PLACEHOLDER -->', '');

            if (this.pomPlugins) {
                content = content.replace(
                    '<!-- PLUGINS_PLACEHOLDER -->',
                    this.pomPlugins
                );
            }
            content = content.replace('<!-- PLUGINS_PLACEHOLDER -->', '');

            fs.writeFileSync(pomPath, content, 'utf8');
        }

        // 2. Process Properties
        const propPath = path.join(this.projectPath, 'src/main/resources/application.properties');
        if (fs.existsSync(propPath) && this.properties) {
            fs.appendFileSync(propPath, this.properties);
        }
    }
}

module.exports = SpringBootGenerator;
