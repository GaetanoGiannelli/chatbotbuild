import http from "http";

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  // Render health check + browser test
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("MCP mock is running ✅");
    return;
  }

  if (req.method === "POST" && req.url === "/") {
    let body = "";

    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log("Received message from chatbot:", data.message);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply: `MCP received: "${data.message}"` }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Mock MCP running on port ${PORT}`);
});
