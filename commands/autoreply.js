const fs = require("fs");

module.exports = {
    name: 'autoreply',
    description: 'Toggle or handle automatic replies with friendly messages',
    execute: async (msg, sock, args = []) => {
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

        // ✅ Handle ".autoreply on/off"
        if (args.length > 0) {
            const choice = args[0].toLowerCase();
            if (choice === "on") {
                status.enabled = true;
                fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
                await sock.sendMessage(from, { text: "✅ Auto-reply is now ON. I’ll be your friendly assistant 🤖✨" });
                return;
            }
            if (choice === "off") {
                status.enabled = false;
                fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
                await sock.sendMessage(from, { text: "❌ Auto-reply is now OFF. See you later! 👋" });
                return;
            }
        }

        // ✅ Auto-reply when enabled
        if (status.enabled) {
            const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            if (body && !body.startsWith(".")) {

                // 🔹 Time-based greeting
                const hour = new Date().getHours();
                let greeting = "Hello";
                if (hour < 12) greeting = "Good morning";
                else if (hour < 18) greeting = "Good afternoon";
                else greeting = "Good evening";

                // 🔹 Keyword-based special replies
                const lowerBody = body.toLowerCase();
                if (["hi", "hello", "hey"].includes(lowerBody)) {
                    await sock.sendMessage(from, { text: `👋 ${greeting}! I’m JM-MD BOT. Type .menu to see my commands.` });
                    return;
                }
                if (["good morning", "good afternoon", "good evening"].includes(lowerBody)) {
                    await sock.sendMessage(from, { text: `🌟 ${body}! Hope you have a great day! Type .menu to see what I can do.` });
                    return;
                }

                // 🔹 Random friendly replies
                const friendlyReplies = [
                    `🤖 ${greeting}! I’m online. Type .menu to explore my commands.`,
                    "✨ Hey there! I’m here to assist you with fun commands and info.",
                    "😄 Hi friend! Need help? Try .menu to see all my features.",
                    "💡 Tip: You can type .fact, .joke, or .quote to get something fun!"
                ];

                const randomReply = friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)];
                await sock.sendMessage(from, { text: randomReply });
            }
        }
    }
};
