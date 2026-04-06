const SESSIONS = [];

function authMiddleware(req, res, next) {
  const AUTH_ROUTES = [
    `GET/api/profile`,
    `POST/api/posts`,
    `GET/api/user`,
    `PUT/api/user`,
    `DELETE/api/logout`,
  ];

  if (!AUTH_ROUTES.includes(req.method + req.url)) {
    return next();
  }

  const sessionId = req.headers.cookie
    ?.split("; ")
    .find((cookie) => cookie.startsWith("sessionId="))
    ?.split("=")[1];
  const session = SESSIONS.find((session) => session.id === sessionId);

  if (!session) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Unauthorized" }));
  }

  req.session = session;
  next();
}

module.exports = { SESSIONS, authMiddleware };
