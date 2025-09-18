// save.js - Auto save status when you reply
const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "save",
    description: "Automatically saves a replied status to internal storage",
    execute: async (sock, msg, args) => {
        try {
            // Only act if this is a reply
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return; // no reply = ignore silently

            // Supported media types
            const mediaTypes = ["imageMessage", "videoMessage", "stickerMessage", "audioMessage"];
            const type = mediaTypes.find(t => quoted[t]);
            if (!type) return; // not media = ignore silently

            // Download media buffer
            const buffer = await downloadMediaMessage(
                { message: quoted }, // wrap in object
                "buffer",
                {},
                { logger: console }
            );

            // File extension
            const ext = type.includes("image") ? ".jpg" :
                        type.includes("video") ? ".mp4" :
                        type.includes("audio") ? ".mp3" : ".webp";

            // Save path → directly to internal storage
            const folder = "/storage/emulated/0/JM-BOT/Status";
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

            const filename = `status_${Date.now()}${ext}`;
            const filepath = path.join(folder, filename);

            fs.writeFileSync(filepath, buffer);

            // No message sent back — stays silent
        } catch (error) {
            console.error("Error auto-saving status:", error);
            // No feedback to user, just log it
        }
    }
};
