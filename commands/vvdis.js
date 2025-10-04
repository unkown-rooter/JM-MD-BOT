// commands/vvdis.js
const fs = require("fs");
const path = require("path");

const toggleFile = path.join(__dirname, "..", "data", "vvdis-toggle.json");

function getToggle() {
    if (!fs.existsSync(toggleFile)) return { enabled: false };
    return JSON.parse(fs.readFileSync(toggleFile));
}

function setToggle(state) {
    fs.writeFileSync(toggleFile, JSON.stringify({ enabled: state }, null, 2));
}

module.exports = {
    name: "vvdis",
    description: "Toggle Anti-Delete for disappearing messages (on/off)",

    async execute(sock, msg, args, config) {
        const from = msg.key.remoteJid;
        const state = args[0]?.toLowerCase();

        if (!state || !["on", "off"].includes(state)) {
            await sock.sendMessage(from, { text: "⚡ Usage: .vvdis on | .vvdis off" });
            return;
        }

        if (state === "on") {
            setToggle(true);
            await sock.sendMessage(from, { text: "✅ VVDis (Anti-Delete) is now *ON*" });
        } else {
            setToggle(false);
            await sock.sendMessage(from, { text: "❌ VVDis (Anti-Delete) is now *OFF*" });
        }
    }
};
