module.exports = {
    name: 'ping',
    description: 'Check if the bot is online and responsive',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        // Measure bot response time
        const start = Date.now();
        const pingMessage = `
🏓 *Pong!* I am online and ready to assist you.
⏱ Response time: calculating...
✨ Tip: Type .menu to see all available commands
`;

        // Send initial message
        const sentMsg = await sock.sendMessage(from, { text: pingMessage });

        // Calculate actual ping after sending
        const end = Date.now();
        const latency = end - start;

        // Update message with latency
        await sock.sendMessage(from, { text: `🏓 *Pong!* I am online and responsive!\n⏱ Response time: ${latency}ms\n✨ Tip: Type .menu to explore all commands` });
    }
};
