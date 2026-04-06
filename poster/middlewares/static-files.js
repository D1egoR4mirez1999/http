const path = require("node:path");
const fs = require("node:fs/promises");

const MIME_TYPES = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  webp: "image/webp",
};

function staticFiles(staticPath) {
  return async (req, res, next) => {
    const filePath = path.join(staticPath, req.url);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext.slice(1)];

    if (!contentType) {
      return next();
    }

    try {
      await fs.access(filePath);
      res.sendFile(filePath, contentType);
    } catch {
      next();
    }
  };
}

module.exports = staticFiles;
