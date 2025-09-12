module.exports = {
    name: 'info',
    description: 'Show bot info, status, and fun features',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        // Calculate uptime
        const uptimeSec = process.uptime();
        const hours = Math.floor(uptimeSec / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const seconds = Math.floor(uptimeSec % 60);

        const infoText = `
💖 *Hello Friend!* I am *JM-MD BOT*, your friendly WhatsApp companion 🤖

📝 *Bot Info:*
• Version: 1.0.0
• Uptime: ${hours}h ${minutes}m ${seconds}s
• Status: Online ✅
• Owner: Type .owner to see

🎉 *Fun Features:*
• .joke – Get a laugh
• .fact – Learn a fun fact
• .quote – Feel inspired
• .riddle – Challenge your mind

✨ Tip: Type .menu to explore all my commands and enjoy your day!
`;

        await sock.sendMessage(from, { text: infoText });
    }
};
