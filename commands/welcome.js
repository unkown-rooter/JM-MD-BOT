// commands/welcome.js
const fs = require("fs");
const path = require("path");

const settingsPath = path.join(__dirname, "../data/settings.json");

// Ensure settings file exists
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({ welcome: false }, null, 2));
}

module.exports = {
    name: "welcome",
    description: "Toggle welcome messages in group (on/off)",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const settings = JSON.parse(fs.readFileSync(settingsPath));

        if (!args[0]) {
            return sock.sendMessage(from, { text: `⚙️ Welcome messages are currently *${settings.welcome ? "ON ✅" : "OFF ❌"}*.\n\nUse: .welcome on / .welcome off` });
        }

        if (args[0].toLowerCase() === "on") {
            settings.welcome = true;
        } else if (args[0].toLowerCase() === "off") {
            settings.welcome = false;
        } else {
            return sock.sendMessage(from, { text: "❌ Invalid option. Use `.welcome on` or `.welcome off`" });
        }

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        await sock.sendMessage(from, { text: `🤖 Welcome messages have been *${settings.welcome ? "ENABLED ✅" : "DISABLED ❌"}*` });
    }
};
