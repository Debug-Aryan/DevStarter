const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

function zipProject(folderPath) {
  return new Promise((resolve, reject) => {
    const zipPath = `${folderPath}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(zipPath));
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });
}

module.exports = { zipProject };
