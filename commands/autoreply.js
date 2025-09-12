const fs = require("fs");

module.exports = {
    name: 'autoreply',
    description: 'Toggle or handle automatic replies',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const statusFile = "./autoreply-status.json";

        // 🔹 Ignore messages sent by the bot itself
        if (msg.key.fromMe) return;

        // 🔹 Ignore system or empty messages
        if (!msg.message || Object.keys(msg.message).length === 0) return;

        // Load current status
        let status = { enabled: false };
        if (fs.existsSync(statusFile)) {
            status = JSON.parse(fs.readFileSync(statusFile));
        }

        // ✅ If user typed ".autoreply on/off"
        if (args.length > 0) {
            const choice = args[0].toLowerCase();

            if (choice === "on") {
                status.enabled = true;
                fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
                await sock.sendMessage(from, { text: "✅ Auto-reply is now ON" });
                return;
            }

            if (choice === "off") {
                status.enabled = false;
                fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
                await sock.sendMessage(from, { text: "❌ Auto-reply is now OFF" });
                return;
            }
        }

        // ✅ If status is ON, reply automatically to normal messages
        if (status.enabled) {
            const body =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                "";

            if (body && !body.startsWith(".")) {
                await sock.sendMessage(from, {
                    text: "🤖 JM-MD BOT AutoReply: I'm here! Type `.menu` to see commands."
                });
            }
        }
    }
};
