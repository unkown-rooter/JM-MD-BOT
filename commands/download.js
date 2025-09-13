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
            await sock.sendMessage(from, { 
                text: `⚠️ Oops! The file *"${fileName}"* could not be found in storage.\n\n📂 Try another name or upload it first into the *downloads* folder.` 
            });
            return;
        }

        // Send a friendly notice before sending
        await sock.sendMessage(from, { 
            text: `📥 Preparing your download...\n\n✅ File: *${fileName}*\n🚀 Please wait a moment...` 
        });

        // Send the file
        await sock.sendMessage(from, { 
            document: fs.readFileSync(filePath), 
            fileName: fileName,
            mimetype: "application/octet-stream",
            caption: `🎉 Here’s your file: *${fileName}*\n\n💡 Tip: You can request another file by typing \`.download <filename>\``
        });
    }
};
