const MernGenerator = require("../generators/MernGenerator");
const NextJsGenerator = require("../generators/NextJsGenerator");
const NodeExpressGenerator = require("../generators/NodeExpressGenerator");
const DjangoGenerator = require("../generators/DjangoGenerator");
const SpringBootGenerator = require("../generators/SpringBootGenerator");
const FlaskGenerator = require("../generators/FlaskGenerator");
const FullStackTSGenerator = require("../generators/FullStackTSGenerator");
const ReactNativeGenerator = require("../generators/ReactNativeGenerator");
const path = require("path");
const fs = require("fs-extra");

module.exports = async (req, res) => {
  const { stack, features, projectInfo } = req.body;
  console.log("Received request:", req.body);

  const finalProjectInfo = projectInfo || {
    name: req.body.projectName,
    description: req.body.projectDescription,
    author: req.body.author
  };

  const projectName = finalProjectInfo.name || 'my-app';
  const tempDir = path.join(__dirname, "..", "..", "temp_projects");

  const projectTempPath = path.join(tempDir, projectName);
  if (fs.existsSync(projectTempPath)) {
    fs.rmSync(projectTempPath, { recursive: true, force: true });
  }

  try {
    let generator;

    if (stack === 'mern') {
      generator = new MernGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else if (stack === 'nextjs') {
      generator = new NextJsGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else if (stack === 'node-express') {
      generator = new NodeExpressGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else if (stack === 'django') {
      generator = new DjangoGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else if (stack === 'spring-boot') {
      generator = new SpringBootGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else if (stack === 'flask') {
      generator = new FlaskGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else if (stack === 'full-stack-ts') {
      generator = new FullStackTSGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else if (stack === 'react-native') {
      generator = new ReactNativeGenerator({
        stack,
        features,
        projectInfo: finalProjectInfo,
        tempDir
      });
    } else {
      throw new Error(`Stack '${stack}' is not supported yet.`);
    }

    const zipPath = await generator.generate();
    const stats = generator.getProjectStats();

    res.set('X-File-Count', stats.fileCount.toString());
    res.set('X-Total-Size', stats.totalSize.toString());
    res.set('Access-Control-Expose-Headers', 'X-File-Count, X-Total-Size');

    res.download(zipPath, `${projectName}.zip`, (err) => {
      if (err) {
        console.error("Download error:", err);
      }
      try {
        fs.rmSync(projectTempPath, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }
    });

  } catch (error) {
    console.error("Generation failed:", error);
    res.status(500).json({ error: "Failed to generate project", details: error.message });
  }
};
