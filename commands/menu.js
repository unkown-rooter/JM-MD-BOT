// commands/menu.js
const fs = require("fs");
const path = require("path");
const { PREFIX, OWNER_NUMBER } = require("../config");

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
  about: "ℹ️",
  advice: "💡",
  autoreply: "🤖",
  autoreplyToggle: "🔄",
  autoview: "👀",
  calculator: "🧮",
  clubmatches: "⚽",
  date: "📅",
  dictionary: "📖",
  download: "⬇️",
  fact: "📚",
  fbdownloader: "📘",
  group: "👥",
  info: "💻",
  joke: "😂",
  meme: "🖼️",
  news: "📰",
  owner: "👑",
  photo: "📸",
  ping: "📡",
  play: "🎶",
  quote: "✍️",
  reload: "♻️",
  reminder: "⏰",
  repo: "🗂️",
  restart: "🔁",
  riddle: "❓",
  save: "💾",
  shutdown: "🛑",
  song: "🎵",
  status: "📊",
  sticker: "🎨",
  time: "⏱️",
  update: "⬆️",
  vcf: "📇",
  videodl: "🎥",
  weather: "🌦️",
  welcome: "🙌",
  ytdown: "▶️",
};

// Categories definition
const categories = {
  "🎉 Fun": ["joke", "meme", "fact", "quote", "riddle", "play", "song"],
  "📖 Utility": ["calculator", "date", "dictionary", "reminder", "time", "weather", "ping", "save", "photo", "sticker", "vcf"],
  "⬇️ Downloads": ["download", "fbdownloader", "videodl", "ytdown"],
  "ℹ️ Info": ["about", "info", "repo", "news", "advice", "clubmatches", "status"],
  "👥 Groups": ["group", "welcome"],
  "🤖 Automation": ["autoview", "autoreply", "autoreplyToggle"],
  "⚙️ System": ["update", "reload", "restart", "shutdown"],
  "👑 Owner Only": ["owner"], // only owner can see
};

function showMenu(sender) {
  const commands = loadCommands();
  const available = commands.map(cmd => cmd.name);

  let menuText = "📜 *JM-MD BOT MENU*\n";

  // Loop categories
  for (const [cat, cmds] of Object.entries(categories)) {
    // Skip Owner section if user isn't owner
    if (cat === "👑 Owner Only" && sender !== OWNER_NUMBER) continue;

    menuText += `\n${cat}:\n`;
    cmds.forEach(name => {
      if (available.includes(name)) {
        const emoji = commandEmojis[name] || "✨";
        menuText += `  ${emoji} ${PREFIX}${name}\n`;
      }
    });
  }

  menuText += `\n⚡ *JapaneseMonk - Fast. Simple. Powerful.*`;
  return menuText;
}

module.exports = {
  name: "menu",
  description: "Show all available bot commands in categories",
  execute: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const menuText = showMenu(sender);
    await sock.sendMessage(from, { text: menuText });
  },
};
