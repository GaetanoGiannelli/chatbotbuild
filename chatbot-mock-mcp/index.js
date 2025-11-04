// Deno MCP Echo Server (No Auth, JSON-RPC 2.0)
Deno.serve(async (req) => {
  if (req.method === "GET") {
    return new Response("MCP Server Running");
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Invalid JSON" },
    });
  }

  const id = body.id ?? "1";
  const text = body?.params?.text;

  if (!text) {
    return json({
      jsonrpc: "2.0",
      id,
      error: { code: -32602, message: "Missing param: text" },
    });
  }

  return json({
    jsonrpc: "2.0",
    id,
    result: { text: `MCP received: "${text}"` },
  });
});

function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { "Content-Type": "application/json" },
  });
}

