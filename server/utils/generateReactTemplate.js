// server/utils/generateReactTemplate.js
const fs = require("fs");
const path = require("path");

module.exports = function generateReactTemplate({ tempDir, stack, features, projectTitle, projectDescription }) {
  const readme = `# ${projectTitle}

${projectDescription}

## Stack: ${stack}
## Features: ${features.length ? features.join(", ") : "None selected"}`;

  fs.writeFileSync(path.join(tempDir, "README.md"), readme);

  // Add more files if needed
};
