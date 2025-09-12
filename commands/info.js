module.exports = {
    name: 'info',
    description: 'Show bot info and status',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        // Calculate uptime
        const uptimeSec = process.uptime();
        const hours = Math.floor(uptimeSec / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const seconds = Math.floor(uptimeSec % 60);

        const infoText = `
🤖 *JM-MD BOT Info*
• Version: 1.0.0
• Uptime: ${hours}h ${minutes}m ${seconds}s
• Status: Online ✅
• Owner: Type .owner to see
        `;

        await sock.sendMessage(from, { text: infoText });
    }
};
