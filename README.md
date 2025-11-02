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
| **Chatbot Worker API** | *your-worker-url* |
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

