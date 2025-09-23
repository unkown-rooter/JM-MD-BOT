// commands/videodl.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    name: "videodl",
    description: "Download video from a direct link (.mp4, .mov, etc.)",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (!args[0]) {
            await sock.sendMessage(from, { text: "⚠️ Please provide a direct video link.\nExample: .videodl https://www.w3schools.com/html/mov_bbb.mp4" });
            return;
        }

        const videoUrl = args[0];
        const tempPath = path.join(__dirname, "../temp/video.mp4");

        try {
            // Download directly from link
            const response = await axios.get(videoUrl, { responseType: "arraybuffer" });

            // Save file
            fs.writeFileSync(tempPath, response.data);

            // Send video
            await sock.sendMessage(from, {
                video: fs.readFileSync(tempPath),
                mimetype: "video/mp4",
                caption: `✅ Downloaded successfully!\n\n🌍 Source: ${videoUrl}`
            });

            // Delete after sending
            fs.unlinkSync(tempPath);

        } catch (error) {
            console.error("Video download error:", error.message);
            await sock.sendMessage(from, { text: "⚠️ Oops! Failed to fetch video. Make sure the link is a direct video (.mp4, .mov)." });
        }
    }
};
