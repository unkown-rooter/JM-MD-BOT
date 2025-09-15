// status.js
const os = require("os");

module.exports = {
    name: 'status',
    description: 'Shows the bot status and uptime',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const uptime = process.uptime(); // in seconds
        const uptimeHours = Math.floor(uptime / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);

        const statusMessage = `📊 *JM-MD BOT Status* 📊

✅ Online and running
⏱️ Uptime: ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s
🖥️ Host: ${os.hostname()}
⚡ Node.js: ${process.version}

✨ Type .menu to see all commands!`;

        await sock.sendMessage(from, { text: statusMessage });
    }
};
