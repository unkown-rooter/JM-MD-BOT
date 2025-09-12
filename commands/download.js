const fs = require("fs");
const path = require("path");

module.exports = {
    name: "download",
    description: "Send a file from bot storage",
    
    async execute(msg, sock, args) {
        const from = msg.key.remoteJid;
        const downloadsDir = path.join(__dirname, "../downloads");

        // Default file to send
        let fileName = args[0] || "sample.pdf"; // If user doesn't specify, send sample.pdf
        const filePath = path.join(downloadsDir, fileName);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            await sock.sendMessage(from, { text: `❌ File "${fileName}" not found.` });
            return;
        }

        // Send the file
        await sock.sendMessage(from, { 
            document: fs.readFileSync(filePath), 
            fileName: fileName,
            mimetype: "application/octet-stream" 
        });
    }
};
