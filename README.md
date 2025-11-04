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
| **Frontend** | *https://chatbot-frontend-4ub.pages.dev/* |
| **Mock MCP Server** | *https://useful-sheep-26.deno.dev/* |

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
   └─ index.js
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

## How to Use

1. Open the frontend

2. Sign up or log in

3. Send messages to the chatbot

4. To connect external MCP:

   4.1 Enter a webhook URL under Connect MCP

   4.2 Save it

5. Send another message to see MCP results added to reply

