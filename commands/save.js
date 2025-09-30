// save.js - Reply .save to a status → bot sends it to your own WhatsApp chat
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "save",
    description: "Reply .save to a status, bot will send it to your own WhatsApp",
    execute: async (sock, msg, args) => {
        try {
            // Only act if this is a reply
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) {
                await sock.sendMessage(msg.key.remoteJid, { text: "❌ Reply to a status with .save" });
                return;
            }

            // Supported media types
            const mediaTypes = ["imageMessage", "videoMessage", "stickerMessage", "audioMessage"];
            const type = mediaTypes.find(t => quoted[t]);
            if (!type) {
                await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Only works on media statuses" });
                return;
            }

            // Download media buffer
            const buffer = await downloadMediaMessage(
                { message: quoted },
                "buffer",
                {},
                { logger: console }
            );

            // Decide how to send back
            const yourNumber = "254743445041@s.whatsapp.net"; // ✅ Your WhatsApp JID
            let message;

            if (type.includes("image")) {
                message = { image: buffer, caption: "📥 Saved status" };
            } else if (type.includes("video")) {
                message = { video: buffer, caption: "📥 Saved status" };
            } else if (type.includes("audio")) {
                message = { audio: buffer, mimetype: "audio/mp4" };
            } else {
                message = { sticker: buffer };
            }

            // Send to your own chat
            await sock.sendMessage(yourNumber, message);

            // Optional confirmation back to current chat
            await sock.sendMessage(msg.key.remoteJid, { text: "✅ Sent saved status to your WhatsApp" });

        } catch (error) {
            console.error("❌ Error saving status:", error);
            await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Failed to save status" });
        }
    }
};
