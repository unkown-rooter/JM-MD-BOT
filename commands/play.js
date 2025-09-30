const yts = require("yt-search");
const playdl = require("play-dl");

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

module.exports = {
  name: "play",
  description: "Download and send a song by title from YouTube",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    try {
      const query = args.join(" ");
      if (!query) {
        return sock.sendMessage(from, { text: "❌ Usage: .play <song title>" });
      }

      // 🔍 Search YouTube
      const search = await yts(query);
      if (!search.videos.length) {
        return sock.sendMessage(from, { text: "⚠️ No results found." });
      }

      const video = search.videos[0];

      // Send info first
      const infoMsg = `🎶 *${video.title}*\n\n👤 ${video.author.name}\n⏱ ${video.timestamp}\n📅 ${video.ago}\n🔗 ${video.url}\n\n⚡ *JM-MD BOT Motto:* Fast. Simple. Powerful.`;
      await sock.sendMessage(from, { text: infoMsg });

      // 🎧 Fetch audio stream
      const stream = await playdl.stream(video.url, { quality: 2 });
      const buffer = await streamToBuffer(stream.stream);

      // ✅ Send audio back
      await sock.sendMessage(from, {
        audio: buffer,
        mimetype: "audio/mp4",
        fileName: `${video.title}.mp3`,
      });

    } catch (err) {
      console.error("Play.js error:", err);
      await sock.sendMessage(from, { text: "⚠️ Could not download audio. Try another song." });
    }
  },
};
