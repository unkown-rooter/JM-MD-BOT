// commands/menu.js
const { showMenu, allCommands } = require("./menuCore");

async function execute(sock, msg, args) {
  const from = msg.key.remoteJid;

  // 🐾 MOTTO header
  const motto = "🐾 JM-MD BOT 🐾\nStable · Smart · Simple\n\n";

  // Send the full menu with motto on top
  await sock.sendMessage(from, { text: motto + showMenu() });
}

// ✅ Handle user replies with numbers
async function handleReply(sock, msg) {
  const from = msg.key.remoteJid;

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
      text: `${emoji} *${cmd.name.toUpperCase()} COMMAND*\n\n📖 Description: ${
        cmd.description || "No description available"
      }\n\n🚀 Motto:\n*Stable · Smart · Simple* 🐾`,
    });
  }
}

module.exports = {
  name: "menu",
  description: "Shows the full JM-MD BOT menu",
  execute,
  handleReply,
};
