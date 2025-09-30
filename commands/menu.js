// commands/menu.js
const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../config");

function loadCommands() {
  const commandsDir = path.join(__dirname);
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith(".js"));
  const commands = [];

  for (const file of files) {
    if (file === "menu.js") continue; // skip itself
    const cmd = require(path.join(commandsDir, file));
    if (cmd && cmd.name) {
      commands.push({
        name: cmd.name,
        description: cmd.description || "No description",
      });
    }
  }
  return commands;
}

// Map of emojis for commands
const commandEmojis = {
  joke: "😂",
  meme: "🖼️",
  fact: "📚",
  quote: "✍️",
  riddle: "❓",
  calculator: "🧮",
  date: "📅",
  dictionary: "📖",
  reminder: "⏰",
  time: "⏱️",
  weather: "🌦️",
  ping: "📡",
  download: "⬇️",
  fbdownloader: "📘",
  videodl: "🎥",
  ytdown: "▶️",
  photo: "📸",
  save: "💾",
  sticker: "🎨",
  about: "ℹ️",
  info: "💻",
  repo: "🗂️",
  group: "👥",
  welcome: "🙌",
  status: "📊",
  autoview: "👀",
  autoreply: "🤖",
  autoreplyToggle: "🔄",
  news: "📰",
  advice: "💡",
  owner: "👑",
  clubmatches: "⚽",
};

function showMenu() {
  const commands = loadCommands();

  let menuText = "📜 *JM-MD BOT MENU*\n\n";
  commands.forEach((cmd, i) => {
    const emoji = commandEmojis[cmd.name] || "✨";
    menuText += `${i + 1}. ${emoji} ${PREFIX}${cmd.name}\n`;
  });

  menuText += `\n⚡ *JapaneseMonk - Fast. Simple. Powerful.*`;

  return menuText;
}

module.exports = {
  name: "menu",
  description: "Show all available bot commands in categories",
  execute: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const menuText = showMenu();
    await sock.sendMessage(from, { text: menuText });
  },
};
