# JM-MD BOT 🤖

**JM-MD BOT** is a **WhatsApp Multi-Device Bot** built using [Baileys](https://github.com/WhiskeySockets/Baileys).  
It allows you to automate WhatsApp tasks, run commands, and manage chats in a simple modular system.

## ✨ Features

### ✅ Current Features
- 📲 Connects to WhatsApp via QR Code (Multi-Device support).
- ⚡ Handles messages in real time.
- 🧩 Modular command system (`commands/` folder) — fully upgraded to safely load API keys from `.env`.
- 🤖 Example commands:
  - `.menu` → Shows available commands
  - `.ping` → Replies with "Pong!"
  - `.hello` → Greets the user
  - `.autoreply` → Automatically responds to incoming messages
- 🔒 Stores session securely inside `auth/` folder.
- 🌐 Ready for deployment (Heroku, Railway, Render, Replit).
- 🔑 Hidden API keys support via `.env` (e.g., Google API key), ensuring safe GitHub usage.

### 🚀 Upcoming Features
- 🎨 Sticker Maker (convert images/videos to WhatsApp stickers).
- 🎵 Media Downloader (YouTube, TikTok, Facebook, Instagram).
- 🛡️ Group Admin Tools (welcome/goodbye messages, anti-link, mute/unmute).
- ⚙️ Custom Commands (easily add new commands in `commands/`).
- 📊 Analytics (track bot usage and performance).
- 🔔 Auto-reply & scheduling system.

## ⚙️ Installation & Setup
Follow these steps to set up **JM-MD BOT** on your machine:

1. **Clone the repository**

```bash
git clone https://github.com/unkown-rooter/JM-MD-BOT.git
cd JM-MD-BOT
