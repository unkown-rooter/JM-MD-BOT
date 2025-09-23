// commands/meme.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    name: "meme",
    description: "Fetches a random meme from API or local memes.json",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            // ✅ 1. Try fetching from Meme API
            const res = await axios.get("https://meme-api.com/gimme");
            if (res.data && res.data.url) {
                await sock.sendMessage(from, {
                    image: { url: res.data.url },
                    caption: `😂 *Here's a meme for you!*\n\n📌 ${res.data.title}\n🔗 ${res.data.postLink}\n\n━━━━━━━━━━━━━━━\n🤖 *JM-MD BOT* — Smooth, Reliable & Fun! ✨`
                });
                return;
            }
        } catch (err) {
            console.error("❌ Meme API failed, falling back to JSON:", err.message);
        }

        // ✅ 2. Fallback: Load from memes.json
        try {
            const memesPath = path.join(__dirname, "../data/memes.json");
            const memes = JSON.parse(fs.readFileSync(memesPath, "utf8"));
            if (Array.isArray(memes) && memes.length > 0) {
                const randomMeme = memes[Math.floor(Math.random() * memes.length)];
                await sock.sendMessage(from, {
                    image: { url: randomMeme },
                    caption: "😂 *Kenyan Meme for you!*\n\n━━━━━━━━━━━━━━━\n🤖 *JM-MD BOT* — Smooth, Reliable & Fun! ✨"
                });
                return;
            }
        } catch (err) {
            console.error("❌ Fallback JSON failed:", err.message);
        }

        // ✅ 3. If everything fails
        await sock.sendMessage(from, { text: "⚠️ Oops! Couldn’t fetch a meme right now. Try again later!" });
    }
};
