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

🤖 Auto-Reply:  
• .autoreply on – Enable auto-reply  
• .autoreply off – Disable auto-reply  

_More commands coming soon..._`;

        await sock.sendMessage(from, { text: menuMessage });
    }
};
