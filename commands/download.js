// commands/download.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "download",
    description: "Download files dynamically from JSON list",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            // Path to JSON file
            const dataPath = path.join(__dirname, "..", "data", "download.json");

            // Read and parse JSON
            const downloads = JSON.parse(fs.readFileSync(dataPath, "utf8"));

            if (!args.length) {
                // No argument: list available downloads
                let listMessage = "📥 *Available Downloads* 📥\n\n";
                downloads.forEach((item, index) => {
                    listMessage += `${index + 1}. *${item.name}*\n   ${item.description}\n   Use: .download ${item.name.toLowerCase().replace(/\s+/g, '')}\n\n`;
                });

                return await sock.sendMessage(from, { text: listMessage });
            }

            // Combine all args for multi-word names
            const query = args.join(" ").toLowerCase().replace(/\s+/g, '');

            // Find the requested file
            const item = downloads.find(d =>
                d.name.toLowerCase().replace(/\s+/g, '') === query
            );

            if (!item) {
                return await sock.sendMessage(from, { text: "⚠️ File not found. Use `.download` to see available files." });
            }

            const filePath = path.join(__dirname, "..", "downloads", item.file);

            if (!fs.existsSync(filePath)) {
                return await sock.sendMessage(from, { text: "⚠️ File missing on server." });
            }

            // Detect file type for proper sending
            const ext = path.extname(item.file).toLowerCase();
            const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

            if (imageExtensions.includes(ext)) {
                // Send as image
                await sock.sendMessage(from, {
                    image: { url: filePath },
                    caption: `📷 ${item.name}`
                });
            } else {
                // Send as document
                await sock.sendMessage(from, {
                    document: { url: filePath },
                    fileName: item.file,
                    mimetype: "application/octet-stream"
                });
            }
        } catch (err) {
            console.error("Error in download command:", err);
            await sock.sendMessage(from, { text: "❌ An error occurred while processing your request." });
        }
    }
};
