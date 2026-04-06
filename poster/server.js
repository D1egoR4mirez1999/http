const crypto = require("crypto");
const Butter = require("../butter");
const staticFiles = require("./middlewares/static-files");
const userRoutes = require("./middlewares/user-routes");
const { SESSIONS, authMiddleware } = require("./middlewares/auth");
const dataMiddleware = require("./middlewares/data");

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
const PORT = 9000;
const HOSTNAME = "localhost";

server.listen(PORT, HOSTNAME);

server.use(userRoutes);
server.use(staticFiles("./public"));
server.use(authMiddleware);
server.use(dataMiddleware);

// Posts
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

server.route("/api/posts", "POST", (req, res) => {
  const { title, body } = req.body;
  const post = {
    id: POSTS.length + 1,
    title,
    body,
    userId: req.session.userId,
  };
  POSTS.push(post);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Post created successfully" }));
});

// Login
server.route("/api/login", "POST", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (user) => user.username === username && user.password === password,
  );

  if (!user) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Invalid username or password" }));
  }

  const session = {
    id: crypto.randomUUID(),
    userId: user.id,
  };

  SESSIONS.push(session);

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Set-Cookie": `sessionId=${session.id}; Path=/`,
  });
  res.end(JSON.stringify({ message: "Login successful" }));
});

server.route("/api/logout", "DELETE", (req, res) => {
  SESSIONS.splice(SESSIONS.indexOf(req.session), 1);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Set-Cookie": "sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  });
  res.end(JSON.stringify({ message: "Logout successful" }));
});

// User
server.route("/api/user", "GET", (req, res) => {
  const user = USERS.find((user) => user.id === req.session.userId);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ username: user.username, name: user.name }));
});

server.route("/api/user", "PUT", (req, res) => {
  const { name, password, username } = req.body;
  const user = USERS.find((user) => user.id === req.session.userId);
  user.name = name;
  user.password = password;
  user.username = username;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "User updated successfully" }));
});
