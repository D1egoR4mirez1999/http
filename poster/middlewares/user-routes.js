function userRoutes(req, res, next) {
  const USER_ROUTES = ["/", "/login", "/profile", "/new-post"];

  if (!USER_ROUTES.includes(req.url) || req.method !== "GET") {
    return next();
  }

  res.sendFile("./public/index.html", "text/html");
}

module.exports = userRoutes;