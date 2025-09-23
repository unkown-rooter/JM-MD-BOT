// commands/fbdownloader.js
const fetch = require("node-fetch");
const { https } = require("follow-redirects");

async function resolveUrl(url) {
    return new Promise((resolve) => {
        try {
            https.get(url, (res) => {
                if (res.responseUrl) resolve(res.responseUrl);
                else resolve(url);
            }).on("error", () => resolve(url));
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
        const match = text.match(/property="og:video" content="([^"]+)"/)
                   || text.match(/og:video:url" content="([^"]+)"/);
        return match ? match[1] : null;
    } catch (err) {
        console.error("FB Video Extraction Error:", err);
        return null;
    }
}

module.exports = {
    name: "fbdownloader",
    description: "Download Facebook videos and Reels directly from a URL",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        if (!args[0]) {
            return sock.sendMessage(from, {
                text: "❌ Please provide a Facebook video URL:\n\nExample: .fbdownloader <url>"
            });
        }

        let url = args[0];

        try {
            if (url.includes("/share/r/")) url = await resolveUrl(url);

            const videoLink = await extractFbVideo(url);

            if (!videoLink) {
                return sock.sendMessage(from, {
                    text: "⚠️ Could not extract video. Make sure the link is public and not reshared/private."
                });
            }

            await sock.sendMessage(from, {
                video: { url: videoLink },
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
