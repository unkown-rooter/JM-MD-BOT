// commands/menu.js
const { showMenu, allCommands } = require("./menuCore");

async function execute(sock, msg, args) {
  const from = msg.key.remoteJid;

  // Send the full menu
  await sock.sendMessage(from, { text: showMenu() });
}

// ✅ Handle user replies with numbers
async function handleReply(sock, msg) {
  const from = msg.key.remoteJid;

  // Extract text safely
  const body =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    "";

  if (!body) return;

  const number = parseInt(body.trim(), 10);

  if (!isNaN(number) && number >= 1 && number <= allCommands.length) {
    const cmd = allCommands[number - 1];
    const emoji = "✨";

    await sock.sendMessage(from, {
      text: `${emoji} *${cmd.name.toUpperCase()} COMMAND*\n\nDescription: ${
        cmd.description || "No description available"
      }\n\n🚀 JM-MD BOT Motto:\n*Smooth, reliable, and fun – just like JM-MD BOT!* ✨`,
    });
  }
}

module.exports = {
  name: "menu",
  description: "Shows the full JM-MD BOT menu",
  execute,
  handleReply,
};
