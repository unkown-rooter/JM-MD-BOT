// commands/sticker.js
const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
  name: "sticker",
  description: "Convert an image or URL into a WhatsApp sticker",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;

    try {
      let imageBuffer;

      // ✅ Case 1: Image sent directly
      if (msg.message.imageMessage) {
        imageBuffer = await sock.downloadMediaMessage(msg, "buffer");
      }
      // ✅ Case 2: URL provided
      else if (args[0] && args[0].startsWith("http")) {
        const response = await axios.get(args[0], { responseType: "arraybuffer" });
        imageBuffer = Buffer.from(response.data, "binary");
      } else {
        return sock.sendMessage(from, {
          text: "❌ Please send an image with caption `.sticker` or use `.sticker <url>`",
        });
      }

      // ✅ Create sticker
      const sticker = new Sticker(imageBuffer, {
        pack: "JM-MD BOT Pack",
        author: "JapaneseMonk",
        type: StickerTypes.FULL, // FULL = keep ratio with padding, CROP = tight fit
        quality: 80, // compression level
      });

      const stickerBuffer = await sticker.build();

      // ✅ Send sticker back
      await sock.sendMessage(from, { sticker: stickerBuffer });

      // ✅ Motto message
      await sock.sendMessage(from, {
        text: "✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨",
      });

    } catch (err) {
      console.error("❌ Sticker error:", err);
      await sock.sendMessage(from, {
        text: "⚠️ Oops! Sticker conversion failed. Please try again with a clear image or valid link.",
      });
    }
  },
};
