// commands/update.js
const { exec } = require("child_process");

module.exports = {
    name: "update",
    description: "Pull latest updates from GitHub and restart bot (Owner only)",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        const owner = process.env.OWNER_NUMBER || "+254743445041";
        if (!sender.includes(owner.replace("+", ""))) {
            await sock.sendMessage(from, { text: "❌ This command is for the owner only!" }, { quoted: msg });
            return;
        }

        await sock.sendMessage(from, { text: "📥 Pulling updates from GitHub...\nPlease wait..." }, { quoted: msg });

        exec("git pull && pm2 restart JM-MD-BOT", (error, stdout, stderr) => {
            if (error) {
                sock.sendMessage(from, { text: "❌ Update failed: " + error.message }, { quoted: msg });
                return;
            }
            sock.sendMessage(from, { text: "✅ Bot updated & restarted!\n\n" + stdout }, { quoted: msg });
        });
    }
};
