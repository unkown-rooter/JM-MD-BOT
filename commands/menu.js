// commands/menu.js
const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../config");

// Dynamically list all commands
function showMenu() {
  const commandFiles = fs.readdirSync(__dirname).filter(f => f.endsWith(".js"));
  let menuText = "📜 *JM-MD BOT MENU*\n\n";

  for (const file of commandFiles) {
    if (file === "menu.js") continue; // avoid listing itself
    try {
      const cmd = require(path.join(__dirname, file));
      if (cmd?.name && cmd?.description) {
        menuText += `➤ *${PREFIX}${cmd.name}* – ${cmd.description}\n`;
      } else if (cmd?.name) {
        menuText += `➤ *${PREFIX}${cmd.name}*\n`;
      }
    } catch (err) {
      console.error(`❌ Error loading ${file}:`, err);
    }
  }

  return menuText;
}

module.exports = {
  name: "menu",
  description: "Show all available bot commands",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const menuText = showMenu();

    await sock.sendMessage(from, { text: menuText });
  }
};
