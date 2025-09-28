// commands/ping.js
const os = require('os');

function formatBytesMb(bytes) {
    return (bytes / 1024 / 1024).toFixed(2);
}

module.exports = {
    name: 'ping',
    description: 'Checks bot status with latency, CPU, platform, Node & memory info',
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key?.remoteJid || msg.chat || msg.sender;

            // 1) Measure latency
            const start = Date.now();
            await sock.sendMessage(from, { text: "🏓 *Pinging...*" });
            const latency = Date.now() - start;

            // 2) Collect info
            const cpus = os.cpus()?.length || "N/A";
            const platform = `${os.type()} ${os.arch()} (${os.platform()})`;
            const nodeVersion = process.version;

            const rssMb = formatBytesMb(process.memoryUsage().rss);
            const heapUsedMb = formatBytesMb(process.memoryUsage().heapUsed);
            const heapTotalMb = formatBytesMb(process.memoryUsage().heapTotal);

            // 3) Compose status message with emojis
            const statusText = 
`🏓 *Pong!*  
JM-MD BOT is online and shining like the sun! 🚀✨

⏱️ *Latency:* ${latency} ms  
🖥️ *CPU Cores:* ${cpus}  
💻 *Platform:* ${platform}  
🟢 *Node:* ${nodeVersion}  

🧠 *Memory (MB)*  
• 🗄️ RSS: ${rssMb} MB  
• 📊 Heap Used: ${heapUsedMb} / ${heapTotalMb} MB`;

            // 4) Send status
            await sock.sendMessage(from, { text: statusText });

        } catch (err) {
            console.error("Error in ping.js:", err);
            try {
                const from = msg.key?.remoteJid || msg.chat || msg.sender;
                await sock.sendMessage(from, {
                    text: "⚠️ Something went wrong while running ping. Check console."
                });
            } catch (e) {
                console.error("Failed to notify user:", e);
            }
        }
    }
};
