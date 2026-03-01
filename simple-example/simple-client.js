const http = require("node:http");

const agent = http.Agent({ keepAlive: true });
const request = http.request({
  agent,
  hostname: "localhost",
  port: 8000,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "application/json",
    "name": "John Doe",
  }
});

request.on("response", (res) => {
  console.log("---------Response----------------");
  console.log(`Status Code: ${res.statusCode} -- Status Message: ${res.statusMessage}`);
  console.log(`Headers:`, res.headers);

  let data = "";

  res.on("data", (chunk) => {
    data = data + chunk.toString();
  });

  res.on("end", () => {
    console.log("---------End----------------");
    console.log(JSON.parse(data));
  });
});

request.write(JSON.stringify({ title: "This is a new post", body: "This is a new post body" }));
request.end();