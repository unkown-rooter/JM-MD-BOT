// commands/download.js
module.exports = {
    name: "download",
    description: "Sends a quick guide on how to use download features",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const message = `
📥 *Download Feature* 📥

Currently this is a demo command.
Soon you'll be able to:
- Download media 🎶📸🎥
- Save files directly 📂
- Get custom links 🔗

✨ Stay tuned for updates!
        `;

        await sock.sendMessage(from, { text: message });
    }
};
