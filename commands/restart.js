const { exec } = require("child_process");

module.exports = {
    name: "restart",
    description: "Restart the bot (owner only)",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || from;
        const ownerNumber = "254743445041"; // ✅ your number

        if (!sender.includes(ownerNumber)) {
            return sock.sendMessage(from, { text: "❌ Only the owner can restart the bot." });
        }

        await sock.sendMessage(from, { text: "♻️ Restarting JM-MD BOT..." });

        exec("pm2 restart JM-MD-BOT", (error, stdout, stderr) => {
            if (error) {
                console.error(`Restart error: ${error.message}`);
                sock.sendMessage(from, { text: "⚠️ Restart failed. Check server logs." });
                return;
            }
            if (stderr) console.error(`stderr: ${stderr}`);
            console.log(`stdout: ${stdout}`);
        });
    }
};
