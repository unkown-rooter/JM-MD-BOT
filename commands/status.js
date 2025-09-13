module.exports = {
    name: 'status',
    description: 'Show bot current status and active features',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        // Load commands dynamically
        const fs = require('fs');
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        const totalCommands = commandFiles.length;

        // Uptime calculation
        const uptimeSec = process.uptime();
        const hours = Math.floor(uptimeSec / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const seconds = Math.floor(uptimeSec % 60);

        const statusText = `
🤖 *JM-MD BOT Status*

🔹 Online: ✅
🔹 Uptime: ⏱ ${hours}h ${minutes}m ${seconds}s
🔹 Auto-Reply: 🤖 Enabled
🔹 Total Commands: ${totalCommands} 💡
🔹 Fun Commands Active: 😂 .joke, 🤯 .fact, ✨ .quote, 🧩 .riddle
🔹 Utility Commands: ⏰ .time, 📅 .date, 🏓 .ping
🔹 Last Update: 🗓 ${new Date().toLocaleString()}

💌 *Friendly Tip*: Type .menu to see all commands and have fun! 🎉
`;

        await sock.sendMessage(from, { text: statusText });
    }
};
