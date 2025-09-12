const config = require("../config");

module.exports = {
    name: "owner",
    description: "Show owner information",

    async execute(sock, msg) {
        const from = msg.key.remoteJid;

        const message = `👑 *Owner Information*  
        
📛 Name: ${config.ownerName}  
📱 Number: ${config.ownerNumber}  
🤖 Bot: ${config.botName}  

_Type .menu to see all commands_`;

        await sock.sendMessage(from, { text: message });
    }
};
