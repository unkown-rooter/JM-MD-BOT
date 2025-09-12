module.exports = {
    name: 'ping',
    description: 'Check if the bot is online',
    execute: async (msg, client) => {
        const chatId = msg.key.remoteJid;
        await client.sendMessage(chatId, { text: '🏓 Pong! I am online.' });
    }
};
