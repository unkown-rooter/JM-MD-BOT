const { ownerName, ownerNumber, botName } = require("../config");

module.exports = {
    name: "menu",
    description: "Show available commands",
    execute: async (sock, from) => {
        const menuText = `
🤖 ${botName} MENU

1. .menu - Show this menu
2. .ping - Replies with "Pong!"
3. .hello - Greets the user
4. .autoreply on/off - Toggle auto-reply
5. .addreply keyword|response - Add an auto-reply
6. .owner - Show owner info

👤 Owner: ${ownerName}
📲 Contact: ${ownerNumber}
        `;
        await sock.sendMessage(from, { text: menuText });
    }
};
