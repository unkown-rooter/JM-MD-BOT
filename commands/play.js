const yts = require("yt-search");
const ytdl = require("ytdl-core");
const axios = require("axios");

const YOUTUBE_API_KEY = "AIzaSyAU2dDq11ZInugkORWBwQd_Yu53-MsftnE";

module.exports = {
  name: "play",
  description: "Download and send a song from YouTube by title",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    try {
      const query = args.join(" ");
      if (!query) {
        return sock.sendMessage(from, { text: "❌ Usage: .play <song title>" });
      }

      // 🔍 Step 1: Search using YouTube Data API
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
      const res = await axios.get(searchUrl);
      const items = res.data.items;
      if (!items || items.length === 0) {
        return sock.sendMessage(from, { text: "⚠️ No results found on YouTube." });
      }

      const video = items[0];
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const channel = video.snippet.channelTitle;
      const thumb = video.snippet.thumbnails.high.url;
      const url = `https://www.youtube.com/watch?v=${videoId}`;

      // 📩 Step 2: Send video info + thumbnail first
      await sock.sendMessage(from, {
        image: { url: thumb },
        caption: `🎶 *${title}*\n👤 ${channel}\n🔗 ${url}\n\n⚡ *JM-MD BOT Motto:* Fast. Simple. Powerful.`
      });

      // 🎧 Step 3: Stream and send audio file
      const stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });

      let chunks = [];
      stream.on("data", chunk => chunks.push(chunk));
      stream.on("end", async () => {
        const buffer = Buffer.concat(chunks);
        await sock.sendMessage(from, {
          audio: buffer,
          mimetype: "audio/mp4",
          fileName: `${title}.mp3`,
        });
      });

      stream.on("error", async (err) => {
        console.error("ytdl error:", err);
        await sock.sendMessage(from, { text: "⚠️ Error downloading audio." });
      });

    } catch (err) {
      console.error("Play.js error:", err);
      await sock.sendMessage(from, { text: "⚠️ Could not fetch or download the song. Try another title." });
    }
  },
};
