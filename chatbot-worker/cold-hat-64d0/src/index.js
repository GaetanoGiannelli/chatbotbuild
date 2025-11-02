export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- Handle CORS preflight ---
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
        },
      });
    }
    env.GEMINI_API_KEY = "AIzaSyBi0hLux5m_pZOeIoFyHsae-JZ87QsD0xc"
    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is undefined!" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- Handle chat requests ---
    if (request.method === "POST" && url.pathname === "/api/chat") {
      try {
        const { message, userId, mcpUrl } = await request.json();

        if (!message || !userId) {
          return new Response(
            JSON.stringify({ error: "Missing message or userId" }),
            { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
          );
        }

        // --- Call Gemini AI ---
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
          const errorText = await aiResponse.text();
          throw new Error(`HTTP error! status: ${aiResponse.status}, message: ${errorText}`);
        }

        const aiData = await aiResponse.json();
        const aiReply = aiData.candidates[0].content.parts[0].text;

        // --- Call MCP server if provided ---
        let mcpReply = null;
        if (mcpUrl) {
          try {
            const resp = await fetch(mcpUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message }),
            });
            const json = await resp.json();
            mcpReply = json.reply || "No reply from MCP";
          } catch (err) {
            mcpReply = `Error calling MCP: ${err.message}`;
          }
        }

        const finalReply = mcpReply ? `AI: ${aiReply}\nMCP: ${mcpReply}` : aiReply;

        return new Response(JSON.stringify({ reply: finalReply }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Internal Server Error", details: err.message }),
          { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
