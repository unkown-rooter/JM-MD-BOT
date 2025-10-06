// commands/spotify.js
// JM-MD BOT Spotify Song Preview Downloader 🎵
// Motto: Fast. Simple. Powerful.

const axios = require("axios");

module.exports = {
  name: "spotify",
  description: "Fetch song preview and details from Spotify Web API",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const query = args.join(" ");
    if (!query)
      return sock.sendMessage(from, { text: "❌ Usage: .spotify <song title>" });

    await sock.sendMessage(from, { text: `🎧 Searching Spotify for "${query}"...` });

    try {
      // Step 1: Get Access Token
      const clientId = "7e055b60831d4dbaabde4659fb4b9db8";
      const clientSecret = "2926ec384b2b4463ba51d0972723d445";

      const tokenRes = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenRes.data.access_token;

      // Step 2: Search Song
      const searchRes = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const track = searchRes.data.tracks.items[0];
      if (!track)
        return sock.sendMessage(from, { text: "⚠️ No songs found on Spotify." });

      const title = track.name;
      const artist = track.artists.map((a) => a.name).join(", ");
      const album = track.album.name;
      const preview = track.preview_url;
      const link = track.external_urls.spotify;
      const cover = track.album.images[0]?.url;

      // Step 3: Send song info or preview
      const caption = `🎶 *${title}*\n👤 ${artist}\n💿 ${album}\n🔗 [Open on Spotify](${link})\n\n⚔️ *Motto:* Fast. Simple. Powerful.`;

      if (preview) {
        await sock.sendMessage(from, {
          audio: { url: preview },
          mimetype: "audio/mpeg",
          caption,
        });
      } else {
        await sock.sendMessage(from, {
          image: { url: cover },
          caption: `${caption}\n\n⚠️ No preview available — open Spotify link.`,
        });
      }
    } catch (err) {
      console.error("Spotify error:", err.message);
      await sock.sendMessage(from, {
        text: "⚠️ Could not fetch from Spotify. Try again later.",
      });
    }
  },
};
