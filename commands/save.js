const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "save",
    description: "Download a status by replying and typing .save",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // Check if this message is a reply
            if (!msg.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                await sock.sendMessage(from, { text: "❌ Please reply to a status to download it using .save" });
                return;
            }

            const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;

            // Check if the replied message has media
            const mediaTypes = ["imageMessage", "videoMessage", "stickerMessage", "audioMessage"];
            const type = mediaTypes.find(t => quoted[t]);
            if (!type) {
                await sock.sendMessage(from, { text: "❌ The replied message does not contain downloadable media." });
                return;
            }

            // Download media
            const buffer = await downloadMediaMessage(quoted, "buffer", {}, { logger: console });

            // Prepare file path
            const ext = type.includes("image") ? ".jpg" :
                        type.includes("video") ? ".mp4" :
                        type.includes("audio") ? ".mp3" : ".webp";

            const folder = path.join(__dirname, "../downloads/status");
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

            const filename = `status_${Date.now()}${ext}`;
            const filepath = path.join(folder, filename);

            fs.writeFileSync(filepath, buffer);

            await sock.sendMessage(from, { text: `✅ Status downloaded successfully!\nSaved as: ${filename}` });

        } catch (error) {
            console.error("Error in .save command:", error);
            await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Failed to download status. Try again!" });
        }
    }
};
