const Butter = require("./butter");

const PORT = 8000;
const HOSTNAME = "127.0.0.1";

const server = new Butter();

server.listen(PORT, HOSTNAME);

server.route("/", "GET", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("/styles.css", "GET", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("/script.js", "GET", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});

server.route("/favicon.ico", "GET", (req, res) => {
  res.sendFile("./public/favicon.ico", "image/x-icon");
});