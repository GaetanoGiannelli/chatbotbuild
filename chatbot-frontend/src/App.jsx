import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const WORKER_URL = import.meta.env.VITE_WORKER_CHAT_URL;

export default function App() {
  const [user, setUser] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [mcpUrl, setMcpUrl] = useState("");
  const [loading, setLoading] = useState(false); // new loading state

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  async function signUp() {
    let email = identifier.includes("@") ? identifier : `${identifier}@example.com`;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Signed up. Now log in.");
  }

  async function signIn() {
    let email = identifier.includes("@") ? identifier : `${identifier}@example.com`;
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else setUser(data.user);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function sendMessage() {
      if (!message.trim()) return;

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const userId = session.data.session?.user?.id;

      if (!userId || !token) {
        alert("Not authenticated");
        return;
      }

      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setLoading(true);
      setMessage("");

      try {
        const resp = await fetch(`${WORKER_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, userId, mcpUrl }), // <-- pass MCP URL here
        });

        if (!resp.ok) throw new Error(`Worker returned ${resp.status}`);

        const data = await resp.json();
        const aiReply = data.reply || "No response from AI";

        setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
      } finally {
        setLoading(false);
      }
    }

  async function connectMcp() {
    const session = await supabase.auth.getSession();
    const userId = session.data.session.user?.id;
    if (!userId) return alert("Not authenticated");

    const { error } = await supabase.from("mcps").insert([{ user_id: userId, webhook_url: mcpUrl }]);
    if (error) alert(error.message);
    else alert("MCP saved!");
  }

  if (!user)
    return (
      <div style={{ padding: 20 }}>
        <h2>Login / Sign Up</h2>
        <input
          placeholder="username or email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <br />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={signUp}>Sign Up</button>
        <button onClick={signIn}>Login</button>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Chatbot</h2>
      Logged in as: {user.email}
      <button onClick={signOut}>Logout</button>

      <hr />

      <div>
        <input
          style={{ width: "60%" }}
          placeholder="Say something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.content}
          </div>
        ))}
      </div>

      <hr />

      <h3>Connect MCP</h3>
      <input
        placeholder="Webhook URL"
        value={mcpUrl}
        onChange={(e) => setMcpUrl(e.target.value)}
      />
      <button onClick={connectMcp}>Save</button>
    </div>
  );
}

