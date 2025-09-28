// commands/about.js
const os = require("os");

module.exports = {
    name: "about",
    description: "About JM-MD BOT and what it can do",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // Calculate uptime
            const uptimeSeconds = process.uptime();
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = Math.floor(uptimeSeconds % 60);
            const uptime = `${hours}h ${minutes}m ${seconds}s`;

            const aboutMessage = `
🤖 *JM-MD BOT v1.0*
━━━━━━━━━━━━━━━━━━━━━━━
📱 *Prefix:* .
🕒 *Uptime:* ${uptime}

🌟 *What I Can Do*

1. 🍯 Share facts, jokes, riddles, and quotes  
2. 🤖 Auto-reply & 👀 status view  
3. 📥 Download media from 🎵 YouTube & 📹 Facebook  
4. 🌤️ Provide weather, 📰 news, and 🔤 dictionary results  
5. 🧮 Perform quick calculations  
6. ⚡ More tools & updates coming soon!  

━━━━━━━━━━━━━━━━━━━━━━━
✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨
`;

            await sock.sendMessage(from, { text: aboutMessage });
        } catch (error) {
            console.error("❌ Error in about.js:", error);
        }
    }
};
