const MernGenerator = require("../generators/MernGenerator");
const NextJsGenerator = require("../generators/NextJsGenerator");
const NodeExpressGenerator = require("../generators/NodeExpressGenerator");
const DjangoGenerator = require("../generators/DjangoGenerator");
const SpringBootGenerator = require("../generators/SpringBootGenerator");
const FlaskGenerator = require("../generators/FlaskGenerator");
const FullStackTSGenerator = require("../generators/FullStackTSGenerator");
const ReactNativeGenerator = require("../generators/ReactNativeGenerator");
const path = require("path");
const os = require('os');
const fs = require("fs-extra");
const { randomUUID } = require('crypto');
const { registerProject } = require('../utils/projectRegistry');
const { parseCookies, serializeCookie } = require('../utils/cookie');

function isHttps(req) {
  // Uses req.secure when trust proxy is enabled; otherwise falls back.
  return Boolean(req.secure || req.protocol === 'https');
}

function getCookieSameSite() {
  const explicit = process.env.GITHUB_COOKIE_SAMESITE;
  if (explicit) return explicit;
  // For cross-site SPA deployments (Vercel client + Render API), cookies must be SameSite=None.
  // Keep Lax for local dev (HTTP) to avoid Secure+None requirements.
  return process.env.NODE_ENV === 'production' ? 'None' : 'Lax';
}

function getBrowserIdCookieName() {
  return process.env.BROWSER_SESSION_COOKIE_NAME || 'ds_browser';
}

function getTempProjectsRoot() {
  // Render (and many hosts) have an ephemeral but writable OS temp directory.
  // Writing into the repo directory can be undesirable or sometimes blocked.
  const explicit = process.env.TEMP_PROJECTS_DIR || process.env.TEMP_PROJECTS_ROOT;
  if (explicit) return path.resolve(String(explicit));

  // Default: OS temp dir (safe in production even if NODE_ENV is unset).
  // Opt-in for repo-root temp projects (useful for local debugging).
  if (process.env.TEMP_PROJECTS_IN_REPO === 'true') {
    return path.resolve(__dirname, '..', '..', 'temp_projects');
  }

  return path.join(os.tmpdir(), 'devstarter', 'temp_projects');
}

async function safeRemove(targetPath, { attempts = 8, baseDelayMs = 150 } = {}) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await fs.promises.rm(targetPath, { recursive: true, force: true });
      return;
    } catch (err) {
      const retryable = err && (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'ENOTEMPTY');
      if (!retryable || attempt === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * attempt));
    }
  }
}

async function safeUnlink(filePath, { attempts = 6, baseDelayMs = 120 } = {}) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await fs.promises.unlink(filePath);
      return;
    } catch (err) {
      if (err && err.code === 'ENOENT') return;
      const retryable = err && (err.code === 'EBUSY' || err.code === 'EPERM');
      if (!retryable || attempt === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * attempt));
    }
  }
}

module.exports = async (req, res) => {
  const { stack, features, projectInfo } = req.body;
  // Avoid logging full request payloads in production (may contain user-provided content).
  if (process.env.NODE_ENV !== 'production') {
    console.log("Received request:", req.body);
  }

  const finalProjectInfo = projectInfo || {
    name: req.body.projectName,
    description: req.body.projectDescription,
    author: req.body.author
  };

  const projectName = finalProjectInfo.name || 'my-app';
  const projectId = randomUUID();
  const tempProjectsRoot = getTempProjectsRoot();
  const projectContainerPath = path.join(tempProjectsRoot, projectId);
  const tempDir = projectContainerPath;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[generate] tempProjectsRoot:', tempProjectsRoot);
    console.log('[generate] projectContainerPath:', projectContainerPath);
  }

  // Generator writes into tempDir/projectName
  const projectTempPath = path.join(projectContainerPath, projectName);

  if (await fs.pathExists(projectContainerPath)) {
    try {
      await safeRemove(projectContainerPath);
    } catch (cleanupErr) {
      console.warn("Pre-cleanup warning:", cleanupErr);
    }
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

    // Security hardening: bind this generated project to a stable browser id cookie.
    // This prevents someone with a leaked projectId from publishing under a different session.
    const cookieName = getBrowserIdCookieName();
    const cookies = parseCookies(req.headers.cookie);
    let browserId = cookies[cookieName] || null;
    if (!browserId) {
      browserId = randomUUID();
      const secure = process.env.GITHUB_COOKIE_SECURE === 'true' ? true : isHttps(req);
      const sameSite = getCookieSameSite();
      // Long-ish lifetime: used only to bind generated projects to the same browser.
      res.setHeader('Set-Cookie', serializeCookie(cookieName, encodeURIComponent(browserId), {
        path: '/',
        httpOnly: true,
        sameSite,
        secure,
        maxAge: 7 * 24 * 60 * 60,
      }));
    }

    // Register for later GitHub publishing.
    registerProject({
      projectId,
      projectContainerPath,
      projectRootPath: projectTempPath,
      projectName,
      browserId,
    });

    res.set('X-File-Count', stats.fileCount.toString());
    res.set('X-Total-Size', stats.totalSize.toString());
    res.set('X-Project-Id', projectId);
    res.set('Access-Control-Expose-Headers', 'X-File-Count, X-Total-Size, X-Project-Id');

    res.download(zipPath, `${projectName}.zip`, (err) => {
      if (err) {
        console.error("Download error:", err);
      }

      (async () => {
        try {
          await safeUnlink(zipPath);
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
      })();
    });

  } catch (error) {
    console.error("Generation failed:", error);
    res.status(500).json({ error: "Failed to generate project", details: error.message });
  }
};
