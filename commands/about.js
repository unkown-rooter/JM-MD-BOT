module.exports = {
    name: "about",
    description: "About the bot and upcoming features",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const aboutMessage = `
🤖 *JM-MD BOT v1.0*  

🌟 *Core Values*
- 24/7 Smart Assistance
- Automation & Productivity
- Fast, Reliable & Interactive
- Professional & User-Friendly

🛠️ *Available Commands*
• .menu – Show all commands  
• .owner – Show owner info  
• .about – About this bot  
• .autoreply – Toggle auto-replies  
• .date – Show today’s date  
• .time – Show current time  

🚀 *Coming Soon*
- Daily facts & motivational quotes  
- Fun riddles & jokes  
- Interactive quizzes & games  
- Personalized commands & features  
- Media tools (downloaders, converters, etc.)  

✨ Powered by JM-MD BOT — always learning, always growing! ✨
`;

        await sock.sendMessage(from, { text: aboutMessage });
    }
};
