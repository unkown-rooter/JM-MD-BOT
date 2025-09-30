const ytdl = require("ytdl-core");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "song",
  description: "Search and download a song from YouTube by title",
  async execute(sock, msg, args) {
    try {
      if (!args.length) {
        return sock.sendMessage(msg.key.remoteJid, { text: "❌ Please give me a song title." });
      }

      // Search YouTube
      const search = await yts(args.join(" "));
      if (!search.videos.length) {
        return sock.sendMessage(msg.key.remoteJid, { text: "❌ No results found." });
      }

      const video = search.videos[0]; // First result

      const infoMsg = `🎶 *${video.title}*\n👤 Author: ${video.author.name}\n🕒 Duration: ${video.timestamp}\n📅 Published: ${video.ago}\n🔗 ${video.url}`;

      // Send info with button
      await sock.sendMessage(msg.key.remoteJid, {
        text: infoMsg + `\n\n⚡ Our MOTTO: *JapaneseMonk - Fast. Simple. Powerful.*`,
        buttons: [
          {
            buttonId: `.download ${video.url}`,
            buttonText: { displayText: "⬇️ Download Song" },
            type: 1,
          },
        ],
        headerType: 1,
      });

    } catch (err) {
      console.error(err);
      sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Failed to search song. Try again later." });
    }
  },
};
