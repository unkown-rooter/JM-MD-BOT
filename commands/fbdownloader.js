// commands/fbdownloader.js
// JM-MD BOT — Facebook Video Downloader
// Motto: Strong like Samurai, Smart like Monk ⚔️🙏

const fetch = require("node-fetch");
const { https } = require("follow-redirects");

async function resolveUrl(url) {
  return new Promise((resolve) => {
    try {
      https
        .get(url, (res) => {
          if (res.responseUrl) resolve(res.responseUrl);
          else resolve(url);
        })
        .on("error", () => resolve(url));
    } catch {
      resolve(url);
    }
  });
}

async function extractFbVideo(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const text = await res.text();

    // Try multiple meta tags
    const match =
      text.match(/property="og:video" content="([^"]+)"/) ||
      text.match(/og:video:url" content="([^"]+)"/) ||
      text.match(/"playable_url":"([^"]+)"/);

    return match ? match[1].replace(/&amp;/g, "&") : null;
  } catch (err) {
    console.error("FB Video Extraction Error:", err);
    return null;
  }
}

module.exports = {
  name: "fbdownloader",
  description: "Download Facebook videos and Reels directly from a link",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const link = args[0];

    if (!link) {
      return sock.sendMessage(from, {
        text: "📘 Please provide a Facebook video link.\nExample: `.fbdownloader https://www.facebook.com/watch?v=12345`",
      });
    }

    let url = link.trim();

    try {
      // 🔁 Handle redirect links (e.g. /share/r/)
      if (url.includes("/share/r/")) url = await resolveUrl(url);

      // 🎬 Try extracting direct video
      const videoLink = await extractFbVideo(url);

      if (videoLink) {
        await sock.sendMessage(from, {
          video: { url: videoLink },
          caption: "✅ Download complete! ⚔️\n\n*JM-MD BOT Motto:* Strong like Samurai, Smart like Monk.",
        });
        return;
      }

      // 🌐 If extraction fails, fallback to FDown.net
      const fbLink = encodeURIComponent(url);
      const fdownUrl = `https://fdown.net/download.php?url=${fbLink}`;

      await sock.sendMessage(from, {
        text: `⚠️ Couldn't extract video directly.\n\n🎬 Click below to open in FDOWN Downloader:\n\n🌐 [Open in FDOWN.net](${fdownUrl})\n\n⚔️ *JM-MD BOT Motto:* Strong like Samurai, Smart like Monk.`,
        linkPreview: true,
      });

    } catch (err) {
      console.error("FB Download Error:", err);
      await sock.sendMessage(from, {
        text: "⚠️ Failed to process the video. Ensure the link is public and try again.",
      });
    }
  },
};
