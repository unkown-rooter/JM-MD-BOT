// commands/vcf.js
const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports = {
    name: "vcf",
    description: "Fetch all group contacts and export as a .vcf file",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = (msg.key.participant || msg.key.remoteJid).replace(/[^0-9]/g, "");

        // ✅ Owner check
        if (!config.OWNERS.includes(sender)) {
            return sock.sendMessage(from, { text: "⛔ Only the bot owner can use this command." });
        }

        // ✅ Make sure it's a group
        if (!from.endsWith("@g.us")) {
            return sock.sendMessage(from, { text: "⚠️ This command only works in groups." });
        }

        try {
            // Get group metadata
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;

            if (!participants || participants.length === 0) {
                return sock.sendMessage(from, { text: "⚠️ No contacts found in this group." });
            }

            // ✅ Build single VCF content
            let vcfData = "";
            participants.forEach((p, index) => {
                const number = p.id.split("@")[0];
                vcfData += `BEGIN:VCARD\nVERSION:3.0\nFN:Member ${index + 1}\nTEL:+${number}\nEND:VCARD\n\n`;
            });

            // ✅ Save file
            const filePath = path.join(__dirname, "../storage/group_contacts.vcf");
            fs.writeFileSync(filePath, vcfData.trim());

            // ✅ Send file back
            await sock.sendMessage(from, {
                document: { url: filePath },
                mimetype: "text/vcard",
                fileName: "JM-MD-BOT-GroupContacts.vcf",
                caption: "📂 All group contacts exported by JM-MD BOT"
            });

        } catch (err) {
            console.error("VCF Error:", err);
            await sock.sendMessage(from, { text: "❌ Failed to export contacts." });
        }
    }
};
