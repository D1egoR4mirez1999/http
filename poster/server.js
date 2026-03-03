const Butter = require("../butter");

const USERS = [
  { id: 1, name: "John Doe", username: "john.doe", password: "string" },
  { id: 2, name: "Jane Doe", username: "jane.doe", password: "string" },
  { id: 3, name: "John Smith", username: "john.smith", password: "string" },
  { id: 4, name: "Jane Smith", username: "jane.smith", password: "string" },
];
const POSTS = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    userId: 1,
  },
];

const server = new Butter();
const PORT = 8000;
const HOSTNAME = "localhost";

server.listen(PORT, HOSTNAME);

server.route("/", "GET", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("/login", "GET", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("/styles.css", "GET", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("/scripts.js", "GET", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

server.route("/api/posts", "GET", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    return {
      ...post,
      author: user.name,
    };
  });
  res.end(JSON.stringify(posts));
});

server.route("/api/login", "POST", (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data = data + chunk.toString();
  });
  req.on("end", () => {
    const { username, password } = JSON.parse(data);
    const user = USERS.find((user) => user.username === username && user.password === password);
    
    if (!user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid username or password" }));
      return;
    }
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Login successful" }));
  });
});
