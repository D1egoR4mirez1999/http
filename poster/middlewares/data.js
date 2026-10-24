function dataMiddleware(req, res, next) {
  if (req.headers["content-type"] !== "application/json") {
    return next();
  }

  let data = [];
  req.on("data", (chunk) => {
    data.push(chunk);
  });

  req.on("end", () => {
    const body = Buffer.concat(data).toString();
    req.body = JSON.parse(body);
    next();
  });
}

module.exports = dataMiddleware;
