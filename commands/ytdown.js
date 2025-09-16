// commands/ytdown.js
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename"); // npm install sanitize-filename

module.exports = {
    name: "ytdown",
    description: "Download YouTube video or audio",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (!args[0]) {
            return sock.sendMessage(from, { text: "❌ Please provide a YouTube link.\nUsage: .ytdown <link> [audio/video]" });
        }

        const url = args[0];
        let type = args[1] ? args[1].toLowerCase() : "video"; // default to video

        if (!["audio", "video"].includes(type)) type = "video";

        try {
            if (!ytdl.validateURL(url)) {
                return sock.sendMessage(from, { text: "❌ Invalid YouTube URL." });
            }

            const info = await ytdl.getInfo(url);
            const title = sanitize(info.videoDetails.title);
            const videoLength = info.videoDetails.lengthSeconds;

            // Warn if video is too long (WhatsApp limit ~16MB)
            const estimatedSizeMB = type === "video" ? (videoLength * 0.5 / 1024) : (videoLength * 0.05 / 1024); // rough estimate
            if (estimatedSizeMB > 16) {
                return sock.sendMessage(from, { text: "⚠️ Video might be too large for WhatsApp. Try audio mode: `.ytdown <link> audio`" });
            }

            const filePath = path.join(__dirname, `${title}.${type === "audio" ? "mp3" : "mp4"}`);

            await sock.sendMessage(from, { text: `⏳ Downloading *${title}* as *${type}* (${Math.floor(videoLength/60)}m ${videoLength%60}s)...` });

            const streamOptions = type === "audio" 
                ? { filter: "audioonly", quality: "highestaudio", highWaterMark: 1<<25 }
                : { filter: "audioandvideo", quality: "highest", highWaterMark: 1<<25 };

            ytdl(url, streamOptions)
                .pipe(fs.createWriteStream(filePath))
                .on("finish", async () => {
                    // Send the file
                    if (type === "audio") {
                        await sock.sendMessage(from, {
                            audio: { url: filePath },
                            mimetype: "audio/mpeg",
                            fileName: `${title}.mp3`,
                            caption: `✅ Downloaded audio: ${title}`
                        });
                    } else {
                        await sock.sendMessage(from, {
                            video: { url: filePath },
                            caption: `✅ Downloaded video: ${title}`
                        });
                    }
                    fs.unlinkSync(filePath);
                });

        } catch (err) {
            console.log(err);
            await sock.sendMessage(from, { text: "❌ Something went wrong while downloading. Try a shorter video or audio mode." });
        }
    }
};
