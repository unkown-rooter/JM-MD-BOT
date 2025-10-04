const ytdl = require("ytdl-core");
const sanitize = require("sanitize-filename");

module.exports = {
    name: "ytdown",
    description: "Download YouTube video or audio",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (!args[0]) {
            return sock.sendMessage(from, { 
                text: "❌ Please provide a YouTube link.\nUsage: .ytdown <link> [audio/video]" 
            });
        }

        const url = args[0];
        let type = args[1] ? args[1].toLowerCase() : "video"; // default to video
        if (!["audio", "video"].includes(type)) type = "video";

        try {
            if (!ytdl.validateURL(url)) {
                return sock.sendMessage(from, { text: "❌ Invalid YouTube URL." });
            }

            const info = await ytdl.getInfo(url);
            const title = sanitize(info.videoDetails.title || "ytfile");
            const lengthSeconds = parseInt(info.videoDetails.lengthSeconds);

            // Rough size check (WhatsApp max ~16MB)
            const estMB = type === "video" 
                ? (lengthSeconds * 0.5 / 1024) 
                : (lengthSeconds * 0.05 / 1024);
            if (estMB > 16) {
                return sock.sendMessage(from, { 
                    text: "⚠️ File might be too large for WhatsApp.\nTry `.ytdown <link> audio` instead." 
                });
            }

            await sock.sendMessage(from, { 
                text: `⏳ Downloading *${title}* as *${type}*...` 
            });

            const chunks = [];
            const options = type === "audio"
                ? { filter: "audioonly", quality: "highestaudio" }
                : { filter: "audioandvideo", quality: "highest" };

            ytdl(url, options)
                .on("data", (chunk) => chunks.push(chunk))
                .on("end", async () => {
                    const buffer = Buffer.concat(chunks);

                    if (type === "audio") {
                        await sock.sendMessage(from, {
                            audio: buffer,
                            mimetype: "audio/mpeg",
                            fileName: `${title}.mp3`,
                            caption: `✅ Downloaded audio: ${title}`
                        });
                    } else {
                        await sock.sendMessage(from, {
                            video: buffer,
                            mimetype: "video/mp4",
                            caption: `✅ Downloaded video: ${title}`
                        });
                    }
                })
                .on("error", async (err) => {
                    console.error("YT error:", err);
                    await sock.sendMessage(from, { text: "❌ Failed to download. Try a shorter video or use audio mode." });
                });

        } catch (err) {
            console.error("YTDown execute error:", err);
            await sock.sendMessage(from, { text: "❌ Unexpected error occurred while downloading." });
        }
    }
};
