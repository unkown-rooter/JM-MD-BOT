module.exports = {
    name: "menu",
    description: "Show available commands",
    execute: async (sock, from) => {
        await sock.sendMessage(from, { 
            text: "🤖 JM-MD BOT MENU:\n\n1. .menu - Show this menu\n2. .ping - Test the bot"
        })
    }
}
