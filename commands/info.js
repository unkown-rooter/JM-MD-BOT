module.exports = {
    name: 'info',
    description: 'Show bot info, status, and fun features',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        // Calculate uptime
        const uptimeSec = process.uptime();
        const hours = Math.floor(uptimeSec / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const seconds = Math.floor(uptimeSec % 60);

        const infoText = `
💖 *Hello Friend!*  
I am *JM-MD BOT*, your 24/7 WhatsApp buddy 🤖✨  

📝 *Bot Info:*  
• 🔖 Version: 1.0.0  
• ⏱ Uptime: ${hours}h ${minutes}m ${seconds}s  
• 🌍 Status: Online & Active ✅  
• 👑 Owner: Type *.owner* to see details  

🎉 *Fun Features You Can Try:*  
• 😂 *.joke* – Get a laugh anytime  
• 🤯 *.fact* – Learn something cool  
• 🌟 *.quote* – Get inspired instantly  
• 🧩 *.riddle* – Test your brainpower  
• 📅 *.date* & ⏰ *.time* – Stay updated  

🚀 *Extra Perks:*  
• 📂 *.download <file>* – Get files easily  
• ⚡ Smart Auto-Reply (toggle with *.autoreply*)  
• 🎮 Games & daily quotes (coming soon!)  

✨ *Tip:* Type *.menu* to explore everything I can do for you!  
💡 Stay positive, you are awesome! 🌸  
`;

        await sock.sendMessage(from, { text: infoText });
    }
};
