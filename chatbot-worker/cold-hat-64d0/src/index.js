export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- CORS Preflight ---
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // --- Chat endpoint ---
    if (request.method === "POST" && url.pathname === "/api/chat") {
      try {
        const { message, userId, mcpUrl } = await request.json();

        if (!message || !userId) {
          return json({ error: "Missing message or userId" }, 400);
        }

        // --- Gemini call ---
        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: message }] }],
            }),
          }
        );

        if (!aiResponse.ok) {
          return json({ error: "Gemini error", details: await aiResponse.text() }, 500);
        }

        const aiData = await aiResponse.json();
        const aiReply = aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "No AI reply";

        // --- MCP call if provided ---
        let mcpReply = null;

        if (mcpUrl) {
          mcpReply = await callMCP(mcpUrl, message);
        }

        const finalReply = mcpReply ? `AI: ${aiReply}\nMCP: ${mcpReply}` : aiReply;

        return json({ reply: finalReply });
      } catch (err) {
        return json({ error: "Server failure", details: err.message }, 500);
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};

// ----------------------
// Helper: Call MCP Server
// ----------------------
async function callMCP(mcpUrl, text) {
  try {
    const resp = await fetch(mcpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "message",
        params: { text },
      }),
      cf: { cacheEverything: false }
    });

    const raw = await resp.text();
    console.log("MCP response raw:", raw);

    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      return `MCP returned non-JSON: ${raw}`;
    }

    // ✅ Valid MCP Server
    if (json.jsonrpc === "2.0") {
      return json.result?.text ?? json.error?.message ?? "Empty MCP response";
    }

    // ❌ Fallback for legacy servers
    if (json.reply) return json.reply;

    return `Unknown MCP response: ${raw}`;
  } catch (err) {
    return `Error calling MCP: ${err.message}`;
  }
}

// ----------------------
// Helpers
// ----------------------
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}
