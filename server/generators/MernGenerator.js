const BaseGenerator = require('./BaseGenerator');
const path = require('path');
const fs = require('fs-extra');

class MernGenerator extends BaseGenerator {
  constructor(args) {
    super(args);
    this.templatesPath = path.join(__dirname, '..', 'templates', 'mern');
  }

  async generate() {
    console.log(`Generating MERN project: ${this.projectName}`);
    console.log(`Detected features:`, this.features);

    // 1. Create structure and copy base template
    this.createTempDir();
    this.copyTemplateFolder(path.join(this.templatesPath, 'base'));

    // 2. Handle Features
    // We'll track package.json updates
    let serverDeps = {};
    let clientDeps = {};
    let clientDevDeps = {};
    let serverScripts = {};
    let clientScripts = {};

    // Helper to merge dependencies
    const addServerDeps = (deps) => Object.assign(serverDeps, deps);
    const addClientDeps = (deps) => Object.assign(clientDeps, deps);
    const addClientDevDeps = (deps) => Object.assign(clientDevDeps, deps);
    const addServerScripts = (scripts) => Object.assign(serverScripts, scripts);
    const addClientScripts = (scripts) => Object.assign(clientScripts, scripts);

    // a. Auth
    if (this.features.includes('auth')) {
      // Auth is now included in the MERN base template (server + client)
      // Keeping the feature flag for backward compatibility with existing UI selections.
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
      // Special handling: Generate README dynamically or copy template and replace
      // The spec says "Create README.md... that uses projectInfo"
      // We can generate it programmatically or use a template with placeholders.
      // Let's use a template approach + placeholders
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
        "prettier": "^3.1.0"
      });
      addServerDeps({
        // Prettier might be devDep on server too, but sticking to simple
      });
      // Add scripts
      addClientScripts({ "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0", "format": "prettier --write ." });
      addServerScripts({ "lint": "eslint .", "format": "prettier --write ." });
    }

    // h. Tailwind
    if (this.features.includes('tailwind')) {
      // Tailwind is now included in the MERN base client template.
      // Keeping the feature flag for backward compatibility.
    }

    // 3. Update package.jsons with gathered deps
    this.updatePackageJson('server/package.json', { dependencies: serverDeps, scripts: serverScripts });
    this.updatePackageJson('client/package.json', { dependencies: clientDeps, devDependencies: clientDevDeps, scripts: clientScripts });

    // 4. Replace Placeholders (Global)
    // e.g. __PROJECT_NAME__, __DESCRIPTION__, __AUTHOR__
    const replacements = {
      '__PROJECT_NAME__': this.projectInfo.name || 'devstarter-project',
      '__PROJECT_DESCRIPTION__': this.projectInfo.description || 'A MERN Stack Project',
      '__AUTHOR__': this.projectInfo.author || 'DevStarter User',
      '__MONGO_URI__': 'mongodb://localhost:27017/myapp' // Default or placeholder
    };

    // Also add feature checkmarks for README
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

module.exports = MernGenerator;
