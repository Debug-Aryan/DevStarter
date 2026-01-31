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

    async generate() {
        console.log(`Generating Spring Boot project: ${this.projectName}`);
        console.log(`Detected features:`, this.features);

        // 1. Create structure and copy base template
        this.createTempDir();
        this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

        // 2. Handle Features

        // a. Auth
        if (this.features.includes('auth')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'auth'));

            // Queue dependencies injection
            const depsPath = path.join(this.templatesPath, 'features', 'auth', 'dependencies.xml');
            if (fs.existsSync(depsPath)) {
                const depsContent = fs.readFileSync(depsPath, 'utf8');
                this.injectPomDependencies(depsContent);
                // Remove the fragment file from the target if it was copied
                const targetDeps = path.join(this.projectPath, 'dependencies.xml');
                try {
                    if (fs.existsSync(targetDeps)) fs.unlinkSync(targetDeps);
                } catch (e) {
                    console.error('Failed to unlink dependencies.xml', e);
                }
            }

            // Queue application.properties
            this.appendProperties(`
# JWT Configuration
jwt.secret=\${JWT_SECRET:changeme}
jwt.expiration=86400000
`);
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

            this.appendProperties(`
# Environment Variable Mappings
server.port=\${SERVER_PORT:8080}
spring.datasource.url=\${DB_URL}
spring.datasource.username=\${DB_USERNAME}
spring.datasource.password=\${DB_PASSWORD}
`);
        }

        // e. Deployment
        if (this.features.includes('deployment')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'deployment'));
        }

        // f. Linting
        if (this.features.includes('linting')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'linting'));

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
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'readme'));
        }

        // h. Tailwind
        if (this.features.includes('tailwind')) {
            this.copyTemplateFolder(path.join(this.templatesPath, 'features', 'tailwind'));
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
