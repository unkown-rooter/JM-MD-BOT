const fs = require("fs");
const path = require("path");

// Load all commands in the same folder, excluding menu files
const commandsPath = __dirname;
const commandFiles = fs.readdirSync(commandsPath).filter(
  file => file.endsWith(".js") && file !== "menu.js" && file !== "menuCore.js"
);

const allCommands = [];

// Load commands
for (const file of commandFiles) {
  try {
    const cmd = require(path.join(commandsPath, file));
    if (cmd?.name) allCommands.push(cmd);
  } catch (err) {
    console.error(`❌ Error loading ${file}:`, err);
  }
}

// Category mapping
const categories = {
  fun: "🎉 Fun Commands",
  utility: "🛠️ Utility Commands",
  downloads: "⬇️ Download Commands",
  group: "👥 Group Commands",
  info: "ℹ️ Info Commands",
  other: "📂 Other Commands"
};

// Emoji mapping (per command name)
const emojiMap = {
  about: "📜",
  advice: "💡",
  autoreply: "🤖",
  autoview: "👁️",
  calculator: "🧮",
  date: "📅",
  dictionary: "📖",
  download: "⬇️",
  fact: "🤔",
  fbdownloader: "🎥",
  group: "👥",
  info: "ℹ️",
  joke: "😂",
  meme: "🖼️",
  news: "📰",
  owner: "👑",
  photo: "📸",
  ping: "🏓",
  quote: "💬",
  reminder: "⏰",
  repo: "📂",
  riddle: "❓",
  save: "💾",
  status: "📊",
  sticker: "🏷️",
  time: "⏱️",
  videodl: "🎬",
  w: "🌦️",
  welcome: "🙌",
  ytdown: "📺"
};

// Function to generate menu text
function showMenu() {
  let menu = `
╔══════════════════════╗
║       *JM-MD BOT*       ║
║ Smooth, reliable & fun! ║
╚══════════════════════╝

📌 Press the number to open a command

━━━━━━━━━━━━━━━━━━
🚀 *Our Motto:*
*Smooth, reliable, and fun – just like JM-MD BOT!* ✨
━━━━━━━━━━━━━━━━━━
💡 Total Commands: ${allCommands.length}
`;

  let counter = 1; // Global numbering across all categories

  // Group commands by category
  for (const [catKey, catTitle] of Object.entries(categories)) {
    const cmds = allCommands.filter(c => (c.category || "other") === catKey);

    if (cmds.length > 0) {
      menu += `\n\n${catTitle}\n`;
      cmds.forEach(cmd => {
        const emoji = emojiMap[cmd.name] || "🔹";
        menu += `${counter}. ${emoji} ${cmd.name}\n`;
        counter++;
      });
    }
  }

  return menu;
}

module.exports = { showMenu, allCommands };
