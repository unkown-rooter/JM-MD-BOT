module.exports = {
    name: "menu",
    description: "Show all available commands",

    async execute(sock, msg) {
        const from = msg.key.remoteJid;

        const menuMessage = `📖 *JM-MD BOT Menu*  

✨ General Commands:  
• .about – About the bot  
• .menu – Show this menu  
• .owner – Show owner info  
• .joke – Get a random joke  
• .fact – Get a random fun fact  
• .quote – Get a friendly quote  
• .riddle – Solve a fun riddle  

🤖 Auto-Reply:  
• .autoreply on – Enable auto-reply  
• .autoreply off – Disable auto-reply  

_More commands coming soon..._`;

        await sock.sendMessage(from, { text: menuMessage });
    }
};
