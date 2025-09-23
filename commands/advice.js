// commands/advice.js
const axios = require("axios");

module.exports = {
    name: "advice",
    description: "Get a random piece of life advice 💡",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            // Fetch advice from API
            const response = await axios.get("https://api.adviceslip.com/advice");
            const advice = response?.data?.slip?.advice;

            if (!advice) {
                throw new Error("No advice received from API");
            }

            // Build message with branding
            const message = `
💡 *Life Advice #1*

"${advice}"

━━━━━━━━━━━━━━━━━━
✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨
            `;

            await sock.sendMessage(from, { text: message });
        } catch (error) {
            console.error("❌ Advice API error:", error.message);

            await sock.sendMessage(from, {
                text: "⚠️ Couldn’t fetch advice right now. Please try again later!"
            });
        }
    }
};
