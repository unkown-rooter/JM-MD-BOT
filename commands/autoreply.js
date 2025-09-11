module.exports = {
    name: 'autoreply',
    description: 'Auto-replies to certain messages',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (!text) return;

        const replyMap = {
            hello: 'Hello! 👋 How can I assist you today?',
            help: 'Sure! Type .menu to see all available commands.',
            ping: 'Pong! 🏓'
        }

        const replyText = replyMap[text.toLowerCase()]
        if (replyText) {
            await sock.sendMessage(from, { text: replyText });
        }
    },
};
