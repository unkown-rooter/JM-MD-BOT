module.exports = {
    name: 'about',
    description: 'About the bot',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, {
            text: '🤖 *JM-MD BOT*\n\nCore Values:\n- 24/7 Assistance\n- Automation & Productivity\n- Fast & Interactive\n\nCommands: .menu, .owner, .autoreply, .about'
        });
    },
};
