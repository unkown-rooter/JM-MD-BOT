// autoreply.js
module.exports = {
    name: 'autoreply',
    description: 'Automatically replies to certain keywords in chat',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const body =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (!body) return;

        // Lowercase for easy matching
        const text = body.toLowerCase();

        // Simple keyword replies
        if (text.includes("hello") || text.includes("hi")) {
            await sock.sendMessage(from, { text: "👋 Hello there! How can I help you today?" });
        } else if (text.includes("bye")) {
            await sock.sendMessage(from, { text: "👋 Goodbye! Have a wonderful day ahead!" });
        } else if (text.includes("thanks") || text.includes("thank you")) {
            await sock.sendMessage(from, { text: "🙏 You’re welcome, buddy!" });
        }
    }
};
