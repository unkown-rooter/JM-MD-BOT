// commands/reload.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "reload",
    description: "Reload all commands (Owner only)",

    async execute(sock, msg, args, commands) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        const owner = process.env.OWNER_NUMBER || "+254743445041";
        if (!sender.includes(owner.replace("+", ""))) {
            await sock.sendMessage(from, { text: "❌ This command is for the owner only!" }, { quoted: msg });
            return;
        }

        try {
            // Clear existing commands
            commands.clear();

            // Reload commands folder
            const commandsPath = path.join(__dirname);
            const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

            for (const file of files) {
                delete require.cache[require.resolve(path.join(commandsPath, file))];
                const cmd = require(path.join(commandsPath, file));
                commands.set(cmd.name, cmd);
            }

            await sock.sendMessage(from, { text: "🔄 Commands reloaded successfully!" }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: "❌ Reload failed: " + err.message }, { quoted: msg });
        }
    }
};
