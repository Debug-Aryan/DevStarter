const MernGenerator = require("../generators/MernGenerator");
const NextJsGenerator = require("../generators/NextJsGenerator");
const NodeExpressGenerator = require("../generators/NodeExpressGenerator");
const DjangoGenerator = require("../generators/DjangoGenerator");
const FullStackTSGenerator = require("../generators/FullStackTSGenerator");
const ReactNativeGenerator = require("../generators/ReactNativeGenerator");
const path = require("path");
const fs = require("fs-extra");

async function createProject({ stack, features, projectInfo, tempDir }) {
  const targetDir = tempDir || path.join(__dirname, "..", "temp");

  const info = projectInfo || {
    name: 'devstarter-project',
    description: 'Generated Project',
    author: 'DevStarter'
  };

  let generator;
  if (stack === 'mern') {
    generator = new MernGenerator({
      stack,
      features,
      projectInfo: info,
      tempDir: targetDir
    });
  } else if (stack === 'nextjs') {
    generator = new NextJsGenerator({
      stack,
      features,
      projectInfo: info,
      tempDir: targetDir
    });
  } else if (stack === 'node-express') {
    generator = new NodeExpressGenerator({
      stack,
      features,
      projectInfo: info,
      tempDir: targetDir
    });
  } else if (stack === 'django') {
    generator = new DjangoGenerator({
      stack,
      features,
      projectInfo: info,
      tempDir: targetDir
    });
  } else if (stack === 'full-stack-ts') {
    generator = new FullStackTSGenerator({
      stack,
      features,
      projectInfo: info,
      tempDir: targetDir
    });
  } else if (stack === 'react-native') {
    generator = new ReactNativeGenerator({
      stack,
      features,
      projectInfo: info,
      tempDir: targetDir
    });
  } else {
    throw new Error(`Stack '${stack}' is not supported yet.`);
  }

  return await generator.generate();
}

module.exports = { createProject };
