function dataMiddleware(req, res, next) {
  if (req.headers["content-type"] !== "application/json") {
    return next();
  }

  let data = "";
  req.on("data", (chunk) => {
    data = data + chunk.toString();
  });

  req.on("end", () => {
    req.body = JSON.parse(data);
    next();
  });
}

module.exports = dataMiddleware;
