# Chatbot Assessment Project
The goal of this assessment is to build a simple but complete chatbot using Cloudflare Workers and Supabase.
This project implements a simple chatbot system with user authentication, AI responses, and optional external MCP tool integration.

## Tech Stack
| Component | Technology |
|----------|------------|
| Backend (Chat API) | **Cloudflare Workers** |
| Frontend UI | **React (Vite)** |
| Authentication & Database | **Supabase** |
| AI Model | **Google Gemini API** |
| External Tool Integration | **MCP Server via Webhook** |

---

## Live URLs (if deployed)

| Component | URL |
|----------|-----|
| **Chatbot Worker API** | *https://cold-hat-64d0.gaetanogiannelligg.workers.dev/* |
| **Frontend** | *localhost:5173* |
| **Mock MCP Server** | *localhost:3001* |

---

## Features

✅ User sign up & login (username/password, no email verification)  
✅ Authenticated chat UI  
✅ AI responses using Gemini model  
✅ Ability to save MCP webhook URL to user profile  
✅ Automatic MCP call when MCP is connected  
✅ Fully working local

---

## Project Structure
```
chatbotbuild
|
├─ chatbot-worker → Cloudflare Worker backend (chat + MCP call)
|  └─ cold-hat-64d0
|     └─ src
|        └─ index.js
├─ chatbot-frontend → React app (authentication + chat UI)
|  └─ src
|     └─ App.jsx
└─ chatbot-mock-mcp → Example MCP webhook server
   └─ mock-mcp.js
```
---

## Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/GaetanoGiannelli/chatbotbuild.git
cd chatbotbuild
```
### Frontend

#### 2.1 Frontend .env
```bash
cp chatbot-frontend/.env.example chatbot-frontend/.env
# Now is already filled, but in general fill the values
```

#### 2.2 Run Frontend

```bash
cd chatbot-frontend
npm install
npm run dev
```

### 3. Run Mock MCP Server

```bash
cd chatbot-mock-mcp
node mock-mcp.js
```
> **WARNING**: The local mock MCP server only works if you run the chatbot worker locally. In this case, you must set the previous Chatbot Worker API to `http://localhost:8787`.
Remember to update the `VITE_WORKER_CHAT_URL` environment variable in `chatbot-frontend/.env`

## How to Use

1. Open the frontend

2. Sign up or log in

3. Send messages to the chatbot

4. To connect external MCP:

5. Enter a webhook URL under Connect MCP

6. Save it

7. Send another message to see MCP results added to reply

## TODO
1. Deploy frontend
2. Deploy Mock MCP Server

