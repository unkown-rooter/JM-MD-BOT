module.exports = {
  name: 'owner',
  description: 'Shows the bot owner info',
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;

    // Owner info
    const ownerNumber = "+254743445041"; // Your WhatsApp number
    const ownerName = "JapaneseMonk";

    const messageText = `
👤 *Bot Owner Info*

Name: ${ownerName}
Number: ${ownerNumber}

You can contact the owner for inquiries, support, or suggestions.
`;

    // Send the owner info
    await sock.sendMessage(from, { text: messageText });
  },
};
