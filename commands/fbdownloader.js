// commands/fbdownloader.js
const fbDownloader = require("fb-video-downloader");
const { https } = require("follow-redirects");

async function resolveUrl(url) {
    return new Promise((resolve) => {
        try {
            https.get(url, (res) => {
                // responseUrl contains the final resolved URL
                if (res.responseUrl) {
                    resolve(res.responseUrl);
                } else {
                    resolve(url); // fallback to original if no redirect
                }
            }).on("error", () => resolve(url)); // fallback on error
        } catch {
            resolve(url); // never crash, return original
        }
    });
}

module.exports = {
    name: "fbdownloader",
    description: "Download Facebook videos and Reels directly from a URL",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        // Step 1: Validate input
        if (!args[0]) {
            return sock.sendMessage(from, { 
                text: "❌ Please provide a Facebook video URL:\n\nExample: .fbdownloader <url>" 
            });
        }

        let url = args[0];

        try {
            // Step 2: Resolve share/reshare URLs
            if (url.includes("/share/r/")) {
                url = await resolveUrl(url);
            }

            // Step 3: Attempt to download
            const result = await fbDownloader(url);

            if (!result) {
                return sock.sendMessage(from, { 
                    text: "⚠️ No downloadable video found. Make sure the link is public." 
                });
            }

            // Step 4: Pick best quality available
            let videoLink = null;
            if (result.hd) videoLink = result.hd;
            else if (result.sd) videoLink = result.sd;
            else if (result.download?.length > 0) videoLink = result.download[0].url;

            if (!videoLink) {
                return sock.sendMessage(from, { 
                    text: "⚠️ Could not extract video. The link may be private or unsupported." 
                });
            }

            // Step 5: Send video back
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
