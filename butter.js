const http = require("node:http");
const fs = require("node:fs/promises");

class Butter {
  constructor() {
    this.server = http.createServer();
    // { "GET/": callback, "POST/": callback }
    this.routes = {};
    this.middleware = [];

    this.server.on("request", (req, res) => {
      const { url, method } = req;
      const route = this.routes[method + url];

      res.sendFile = async (path, contentType) => {
        res.writeHead(200, { "Content-Type": contentType });
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(res);

        fileHandle.on("end", () => {
          fileHandle.close();
        });
      };

      let index = 0;
      const next = () => {
        if (index < this.middleware.length) {
          const middleware = this.middleware[index++];
          middleware(req, res, next);
        } else {
          if (route) {
            route(req, res);
          } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("<h1>404 Not Found</h1>");
          }
        }
      };

      next();
    });
  }

  route(path, method, callback) {
    this.routes[method + path] = callback;
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  listen(port, hostname) {
    this.server.listen(port, hostname, () => {
      console.log(`Server is running on http://${hostname}:${port}`);
    });
  }
}

module.exports = Butter;
