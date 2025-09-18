// commands/sticker.js
const { writeFileSync, unlinkSync } = require('fs');
const path = require('path');
const axios = require('axios');
const { imageToWebp } = require('node-webpmux');

module.exports = {
    name: 'sticker',
    description: 'Convert an image or URL into a WhatsApp sticker. Send an image with caption `.sticker` or `.sticker <image_url> [sticker_name]`',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        try {
            let imageBuffer;

            // ✅ Case 1: Image sent directly
            if (msg.message.imageMessage) {
                imageBuffer = await sock.downloadMediaMessage(msg, 'buffer');
            }
            // ✅ Case 2: URL provided
            else if (args[0] && args[0].startsWith('http')) {
                const response = await axios.get(args[0], { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(response.data, 'binary');
            } else {
                return sock.sendMessage(from, {
                    text: "❌ Please send an image with caption `.sticker` or use `.sticker <image_url> [sticker_name]`"
                });
            }

            // ✅ Check file size (limit 5 MB)
            if (imageBuffer.length > 5 * 1024 * 1024) {
                return sock.sendMessage(from, { text: "⚠️ Image too large! Maximum size allowed is 5 MB." });
            }

            // Save temporary file
            const tempFile = path.join(__dirname, '../temp_image');
            writeFileSync(tempFile, imageBuffer);

            // Convert image to WebP (sticker format)
            const webpBuffer = await imageToWebp(tempFile);

            // Sticker name from args or default
            const stickerName = args.slice(1).join(' ') || `sticker_${Date.now()}`;

            // ✅ Send sticker back to user
            await sock.sendMessage(from, { sticker: webpBuffer });

            // ✅ Also send as downloadable WebP file
            await sock.sendMessage(from, {
                document: webpBuffer,
                mimetype: 'image/webp',
                fileName: `${stickerName}.webp`,
                caption: `🎉 Here is your sticker download!\n\n✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨`
            });

            // Clean up temporary file
            unlinkSync(tempFile);

        } catch (error) {
            console.error('❌ Sticker error:', error);
            await sock.sendMessage(from, {
                text: "⚠️ Oops! Something went wrong while creating the sticker. Make sure you sent a valid image or URL (JPEG/PNG)."
            });
        }
    }
};
