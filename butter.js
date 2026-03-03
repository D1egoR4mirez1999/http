const http = require("node:http");
const fs = require("node:fs/promises");

class Butter {
  constructor() {
    this.server = http.createServer();
    // { "/": { GET: callback, POST: callback } }
    this.routes = {};

    this.server.on("request", (req, res) => {
      const { url, method } = req;
      const route = this.routes[url];

      res.sendFile = async (path, contentType) => {
        res.writeHead(200, { "Content-Type": contentType });
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(res);
        
        fileHandle.on("end", () => {
          fileHandle.close();
        });
      }

      if (!route) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
        return;
      }

      route[method](req, res);
    })
  }

  route(path, method, callback) {
    this.routes[path] = {
      [method]: callback
    }
  }

  listen(port, hostname) {
    this.server.listen(port, hostname, () => {
      console.log(`Server is running on http://${hostname}:${port}`);
    });
  }
}

module.exports = Butter;