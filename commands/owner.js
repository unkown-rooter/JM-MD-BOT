const { ownerName, ownerNumber, botName } = require("../config");

module.exports = {
    name: "owner",
    description: "Shows the bot owner info",
    execute: async (client, from, args) => {
        await client.sendMessage(from, {
            text: `🤖 ${botName}\n👤 Owner: ${ownerName}\n📲 Contact: ${ownerNumber}`
        });
    }
};
