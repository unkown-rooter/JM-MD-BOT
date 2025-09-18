// status.js
const os = require("os");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "status",
    description: "Shows the bot status and system information",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || msg.key.participant || "Unknown User";

        // Load JSON config
        const statusPath = path.join(__dirname, "../data/status.json");
        const statusData = JSON.parse(fs.readFileSync(statusPath, "utf8"));

        // Calculate uptime
        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);

        // Memory usage
        const memoryUsage = process.memoryUsage();
        const usedMemoryMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const totalMemoryMB = (os.totalmem() / 1024 / 1024).toFixed(2);

        // Count available commands
        const commandsPath = path.join(__dirname);
        const commandCount = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")).length;

        // Ping test
        const start = Date.now();
        await sock.sendMessage(from, { text: "⏳ Testing speed..." });
        const ping = Date.now() - start;

        let pingStatus = "🟢 Excellent";
        if (ping > 300) pingStatus = "🔴 Slow";
        else if (ping > 100) pingStatus = "🟡 Average";

        // Current time
        const now = new Date();
        const currentTime = now.toLocaleString();

        // Build message using JSON data
        const statusMessage = `📊 *${statusData.botName} Status* 📊

✅ Online and running
⏱️ Uptime: *${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s*
📅 Date & Time: *${currentTime}*
⚡ Ping: *${ping}ms* (${pingStatus})

🖥️ Host: *${os.hostname()}*
🛠️ Platform: *${os.platform()} (${os.arch()})*
💾 Memory: *${usedMemoryMB}MB / ${totalMemoryMB}MB*

📂 Total Commands: *${commandCount}*
🙋 Requested by: *${sender}*

👤 Owner: *${statusData.owner.name}*
📞 Contact: *${statusData.owner.number}*

${statusData.motto}

📌 Version: *${statusData.version}*
🌐 GitHub: ${statusData.links.github}

✨ Type *.menu* to see all commands!`;

        await sock.sendMessage(from, { text: statusMessage });
    }
};
