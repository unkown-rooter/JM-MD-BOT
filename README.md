# ![JM-MD BOT Logo](assets/imglogo.png)  
# JM-MD BOT 🤖

**JM-MD BOT** is a **WhatsApp Multi-Device Bot** built using [Baileys](https://github.com/WhiskeySockets/Baileys).  
It allows you to automate WhatsApp tasks, run commands, and manage chats in a modular way.

---

## 🚀 Our Motto
*Smooth, reliable, and fun – just like JM-MD BOT!* ✨

---

## ✨ Current Features

- 📲 Connects to WhatsApp via QR Code (Multi-Device support).
- ⚡ Handles messages in real time.
- 🧩 Modular command system (`commands/` folder).
- 🤖 Commands:
  - `.menu` → Shows available commands
  - `.about` → Info about the bot
  - `.owner` → Owner details
- 🔁 Auto-Reply System  
  - `autoreply.js` handles all normal chats automatically.  
  - Status stored in `autoreply-status.json`.  
  - Custom responses stored in `autoreplies.json`.
- 👀 AutoView toggle (`autoview.js`)
- 🧮 Calculator command (`calculator.js`)
- 💾 Save statuses and media (`save.js`, `download.js`, `ytdown.js`)
- 🔹 Facebook & YouTube downloader (`fbdownloader.js`, `ytdown.js`)
- 🏓 Ping command (`ping.js`) to check bot status
- ⏱️ Reminder system (`reminder.js`)
- 🔒 Secure session in `auth/` folder.
- 🌐 Ready for deployment (Heroku, Railway, Render, Replit).
- 🔑 API key support via `.env`.

---

## 🚀 Upcoming Features

- 🎨 Sticker Maker (convert images/videos to stickers).
- 🎵 Media Downloader (YouTube, TikTok, Instagram, Facebook).
- 🛡️ Group Admin Tools (welcome/goodbye, anti-link, mute/unmute).
- ⚙️ Custom Commands (easily add new ones).
- 📊 Analytics & Usage Tracking.
- 🔔 Auto-reply scheduling system.

---

## ⚙️ Setup

```bash
# Clone repo
git clone https://github.com/unkown-rooter/JM-MD-BOT.git
cd JM-MD-BOT

# Install dependencies
npm install

# Start bot
node index.js
