const http = require("node:http");
const fs = require("node:fs/promises");

const PORT = 8000;
const HOSTNAME = "127.0.0.1";

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const fileHandle = await fs.open("./public/index.html", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(res);
    fileHandle.close();
  }

  if (req.url === "/styles.css" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/css" });
    const fileHandle = await fs.open("./public/styles.css", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(res);
    fileHandle.close();
  }

  if (req.url === "/script.js" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    const fileHandle = await fs.open("./public/script.js", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(res);
    fileHandle.close();
  }

  if (req.url === "/favicon.ico" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    const fileHandle = await fs.open("./public/favicon.ico", "r");
    const fileStream = fileHandle.createReadStream();``
    fileStream.pipe(res);
    fileHandle.close();
  }

  if (req.url === "/upload-image"  && req.method === "PUT") {
    res.writeHead(200, { "Content-Type": "application/json" });

    const fileHandle = await fs.open("./public/assets/img.png", "w");
    const fileStream = fileHandle.createWriteStream();

    req.pipe(fileStream);

    req.on("end", () => {
      res.end(JSON.stringify({ message: "Image uploaded successfully" }));
      fileHandle.close();
    })
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});