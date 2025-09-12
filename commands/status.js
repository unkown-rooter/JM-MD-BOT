module.exports = {
    name: 'status',
    description: 'Show bot current status',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        // Here you can customize status info
        const statusText = `
🤖 *JM-MD BOT Status*
• Online: ✅
• Auto-Reply: ✅
• Commands loaded: ${Object.keys(require('./index.js').commands || {}).length}
        `;

        await sock.sendMessage(from, { text: statusText });
    }
};
