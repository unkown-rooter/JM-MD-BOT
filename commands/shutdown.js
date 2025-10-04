// commands/shutdown.js
const { exec } = require("child_process");

module.exports = {
    name: "shutdown",
    description: "Shutdown the bot (Owner only)",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        const owner = process.env.OWNER_NUMBER || "+254743445041";
        if (!sender.includes(owner.replace("+", ""))) {
            await sock.sendMessage(from, { text: "❌ This command is for the owner only!" }, { quoted: msg });
            return;
        }

        await sock.sendMessage(from, { text: "⏹️ Shutting down bot..." }, { quoted: msg });

        exec("pm2 stop JM-MD-BOT", (error, stdout, stderr) => {
            if (error) {
                sock.sendMessage(from, { text: "❌ Failed to shutdown: " + error.message }, { quoted: msg });
                return;
            }
            sock.sendMessage(from, { text: "✅ Bot stopped successfully!" }, { quoted: msg });
        });
    }
};
