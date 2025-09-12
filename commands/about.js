module.exports = {
    name: 'about',
    description: 'About the bot and upcoming features',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        const aboutMessage = `
🤖 *JM-MD BOT*

Core Values:
- 24/7 Assistance
- Automation & Productivity
- Fast & Interactive

Available Commands:
• .menu – Show all commands
• .owner – Show owner info
• .autoreply – Toggle auto-replies
• .about – This message

🚀 *Coming Soon*:
- Daily facts & motivational quotes
- Fun riddles & jokes
- Interactive quizzes and games
- More personalized commands

Stay tuned for updates! ✨
`;

        await sock.sendMessage(from, { text: aboutMessage });
    },
};
