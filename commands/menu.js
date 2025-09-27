// commands/menu.js
const { PREFIX } = require("../config");

function showMenu() {
  let menuText = "📜 *JM-MD BOT MENU*\n\n";

  // 🎉 Fun Commands
  menuText += "🎉 *Fun Commands*\n";
  menuText += `1. ${PREFIX}joke 🤣 (Joke)\n`;
  menuText += `2. ${PREFIX}meme 🖼️ (Meme)\n`;
  menuText += `3. ${PREFIX}fact 📚 (Fact)\n`;
  menuText += `4. ${PREFIX}quote 📝 (Quote)\n`;
  menuText += `5. ${PREFIX}riddle ❓ (Riddle)\n\n`;

  // 🛠️ Utility Commands
  menuText += "🛠️ *Utility Commands*\n";
  menuText += `6. ${PREFIX}calculator 🔢 (Calculator)\n`;
  menuText += `7. ${PREFIX}date 📅 (Date)\n`;
  menuText += `8. ${PREFIX}dictionary 📖 (Dictionary)\n`;
  menuText += `9. ${PREFIX}reminder ⏰ (Reminder)\n`;
  menuText += `10. ${PREFIX}time ⏱️ (Time)\n`;
  menuText += `11. ${PREFIX}weather 🌦️ (Weather)\n`;
  menuText += `12. ${PREFIX}ping 📡 (Ping)\n\n`;

  // 📥 Downloaders
  menuText += "📥 *Downloaders*\n";
  menuText += `13. ${PREFIX}download ⬇️ (Downloader)\n`;
  menuText += `14. ${PREFIX}fbdownloader 📘 (Facebook Downloader)\n`;
  menuText += `15. ${PREFIX}videodl 🎥 (Video Downloader)\n`;
  menuText += `16. ${PREFIX}ytdown ▶️ (YouTube Downloader)\n`;
  menuText += `17. ${PREFIX}photo 📸 (Photo)\n`;
  menuText += `18. ${PREFIX}save 💾 (Save)\n`;
  menuText += `19. ${PREFIX}sticker 🎨 (Sticker)\n\n`;

  // 🤖 Bot Info
  menuText += "🤖 *Bot Info*\n";
  menuText += `20. ${PREFIX}about ℹ️ (About Bot)\n`;
  menuText += `21. ${PREFIX}info 🖥️ (Info)\n`;
  menuText += `22. ${PREFIX}repo 🗂️ (Repository)\n\n`;

  // 👥 Group & Status
  menuText += "👥 *Group & Status*\n";
  menuText += `23. ${PREFIX}group 👥 (Group)\n`;
  menuText += `24. ${PREFIX}welcome 🙌 (Welcome)\n`;
  menuText += `25. ${PREFIX}status 📊 (Status)\n`;
  menuText += `26. ${PREFIX}autoview 👀 (Auto View)\n`;
  menuText += `27. ${PREFIX}autoreply 🤖 (Auto Reply)\n`;
  menuText += `28. ${PREFIX}autoreplyToggle 🔄 (Toggle Auto Reply)\n\n`;

  // 📰 News & Advice
  menuText += "📰 *News & Advice*\n";
  menuText += `29. ${PREFIX}news 📰 (News)\n`;
  menuText += `30. ${PREFIX}advice 💡 (Advice)\n\n`;

  // 👑 Owner
  menuText += "👑 *Owner*\n";
  menuText += `31. ${PREFIX}owner 👑 (Owner Info)\n`;

  return menuText;
}

module.exports = {
  name: "menu",
  description: "Show all available bot commands in categories",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const menuText = showMenu();
    await sock.sendMessage(from, { text: menuText });
  }
};
