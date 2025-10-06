# ⚔️ JM-MD-BOT — WhatsApp Multi-Function Bot

> **Motto:** Strong like Samurai, Smart like Monk 🙏  
> **Created by:** JapaneseMonk  
> **Power:** Fast • Simple • Powerful

---

## 🌐 Overview

**JM-MD-BOT** is a smart, modular WhatsApp bot built with **Node.js**.  
It performs multiple functions — downloading videos, fetching music, searching for APKs, and more — directly inside WhatsApp chats.

This bot connects to WhatsApp via the **Baileys** library and supports **Termux**, **Windows**, and **Linux** environments.

---

## 📦 Features

✅ YouTube Song Downloader (`.play`)  
✅ Facebook Video Downloader (`.fbdownloader`)  
✅ APK Downloader (`.apk`)  
✅ News, Facts, and Daily Quotes Commands  
✅ Multi-Device Ready  
✅ MongoDB + Render Integration (Optional)  
✅ Auto-Restart with PM2  

---

## ⚙️ Installation Guide

Below are **three installation paths** — choose the one for your device.

---

### 🟢 1. TERMUX SETUP (Android)

**📲 Step-by-Step Commands:**

```bash
# Update Termux packages
pkg update && pkg upgrade -y

# Install required dependencies
pkg install nodejs git ffmpeg imagemagick -y

# Clone JM-MD-BOT repository
git clone https://github.com/unkown-rooter/JM-MD-BOT.git

# Enter the project directory
cd JM-MD-BOT

# Install all node dependencies
npm install

# Start the bot
node index.js

### 🟢 2. PC ( Windows)
PC (Windows)

📋 Requirements:

Node.js (v18 or higher)

Git

FFmpeg

Internet connection

🧩 Commands:
# Open PowerShell or Command Prompt
cd Desktop

# Clone the bot
git clone https://github.com/unkown-rooter/JM-MD-BOT.git

# Go to folder
cd JM-MD-BOT

# Install dependencies
npm install

# Start the bot
node index.js

###linux###

LINUX (Ubuntu / Debian)

🔧 Setup Commands:
# Update packages
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install git nodejs npm ffmpeg -y

# Clone the bot repository
git clone https://github.com/unkown-rooter/JM-MD-BOT.git

# Move inside the folder
cd JM-MD-BOT

# Install Node packages
npm install

# Start the bot
node index.js

###pm2###

***pm2 24/7***
npm install pm2 -g
pm2 start server.js --name JM-MD-BOT
pm2 save
pm2 startup


