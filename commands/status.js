module.exports = {
    name: 'status',
    description: 'Show bot current status and active features',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        // Load commands dynamically
        const fs = require('fs');
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        const totalCommands = commandFiles.length;

        const statusText = `
🤖 *JM-MD BOT Status*

• Online: ✅
• Auto-Reply: ✅
• Total Commands: ${totalCommands}
• Fun Commands Active: 😂 .joke, .fact, .quote, .riddle
• Last Update: ${new Date().toLocaleString()}

💡 *Tip*: Type .menu to see all commands and enjoy the features!
`;

        await sock.sendMessage(from, { text: statusText });
    }
};
