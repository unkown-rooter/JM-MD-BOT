module.exports = {
    name: 'menu',
    description: 'Shows a list of available commands with buttons',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const menuButtons = [
            { buttonId: '.menu', buttonText: { displayText: 'Menu' }, type: 1 },
            { buttonId: '.owner', buttonText: { displayText: 'Owner Info' }, type: 1 },
            { buttonId: '.autoreply', buttonText: { displayText: 'Autoreply' }, type: 1 },
            { buttonId: '.about', buttonText: { displayText: 'About' }, type: 1 },
        ];

        const menuMessage = {
            text: '🤖 *JM-MD BOT MENU*\n\nTap a button below to execute a command:',
            buttons: menuButtons,
            headerType: 1,
        };

        await sock.sendMessage(from, menuMessage);
    },
};
