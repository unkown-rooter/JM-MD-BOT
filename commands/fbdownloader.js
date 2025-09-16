// commands/fbdownloader.js
const fbDownloader = require('fb-video-downloader');

module.exports = {
    name: 'fbdownloader',
    description: 'Download Facebook videos and Reels directly from a URL',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        // Check if user provided a URL
        if (!args[0]) {
            return sock.sendMessage(from, { text: "❌ Please provide a Facebook video URL: .fbdownloader <url>" });
        }

        const url = args[0];

        try {
            // Download the video
            const result = await fbDownloader(url);

            // Send the video back to user
            await sock.sendMessage(from, {
                video: { url: result.video },
                caption: "✅ Here’s your Facebook video, buddy!"
            });
        } catch (err) {
            console.error("FB Download Error:", err);
            await sock.sendMessage(from, {
                text: "⚠️ Failed to download the video. Make sure the URL is correct and public."
            });
        }
    }
};
