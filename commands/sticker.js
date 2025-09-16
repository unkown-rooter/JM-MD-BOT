// sticker.js
const { writeFileSync, unlinkSync } = require('fs');
const { fromBuffer } = require('file-type');
const { imageToWebp } = require('node-webpmux');

module.exports = {
    name: 'sticker',
    description: 'Convert an image into a WhatsApp sticker. Send an image with caption .sticker',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        try {
            // Check if message has an image
            let imageBuffer;

            if (msg.message.imageMessage) {
                imageBuffer = await sock.downloadMediaMessage(msg, 'buffer');
            } else {
                return sock.sendMessage(from, { text: "Please send an image with caption .sticker" });
            }

            // Save temporary file
            const tempFile = `/data/data/com.termux/files/home/JM-MD-BOT/temp_image`;
            writeFileSync(tempFile, imageBuffer);

            // Convert image to WebP (sticker format)
            const webpBuffer = await imageToWebp(tempFile);

            // Send sticker back to user
            await sock.sendMessage(from, { sticker: webpBuffer });

            // Clean up temporary file
            unlinkSync(tempFile);

        } catch (error) {
            console.error('Sticker error:', error);
            await sock.sendMessage(from, { text: "Oops! Something went wrong while creating the sticker." });
        }
    }
};
