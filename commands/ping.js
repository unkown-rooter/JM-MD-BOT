module.exports = {
    name: 'ping',
    description: 'Check if the bot is online and responsive',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        const pingMessage = `
🏓 Pong! I am online and ready to assist you.
✨ Tip: Type .menu to see all available commands
`;

        await sock.sendMessage(from, { text: pingMessage });
    }
};
