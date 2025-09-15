// commands/ping.js
module.exports = {
    name: 'ping',
    description: 'Checks if the bot is alive',
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key?.remoteJid || msg.chat || msg.sender;

            await sock.sendMessage(from, {
                text: "🏓 *Pong!*\n\nJM-MD BOT is online and running smoothly 🚀✨"
            });
        } catch (err) {
            console.error("Error in ping.js:", err);
        }
    }
};
