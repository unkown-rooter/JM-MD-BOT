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
node server.js
