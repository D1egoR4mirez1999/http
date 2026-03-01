const http = require("node:http");

const PORT = 8000;
const HOSTNAME = "localhost";
const server = http.createServer();

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});

let name = "";
let data = "";

server.on("request", (req, res) => {
  name = req.headers.name;

  console.log(`Headers:`, req.headers);

  req.on("data", (chunk) => {
    data = data + chunk.toString();
  });

  req.on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Post with title ${JSON.parse(data).title} created successfully by ${name}` }));

    data = "";
    name = "";
  });
});