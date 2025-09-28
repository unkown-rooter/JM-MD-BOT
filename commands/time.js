// commands/time.js
module.exports = {
    name: "time",
    description: "Show the current time with friendly greetings and tips",
    async execute(sock, msg, args) {
        try {
            const now = new Date(); // ✅ Reads your PC's current time
            const time = now.toLocaleTimeString([], { hour12: true }); // Uses PC local time
            const day = now.toLocaleDateString([], { 
                weekday: "long", month: "long", day: "numeric", year: "numeric" 
            });

            // Dynamic greetings based on hour
            let dayPeriod = "";
            const hour = now.getHours();
            if (hour >= 5 && hour < 12) dayPeriod = "🌅 Good Morning! ✨";
            else if (hour >= 12 && hour < 14) dayPeriod = "🍽️ Enjoy your lunch! ✨";
            else if (hour >= 14 && hour < 18) dayPeriod = "☀️ Good Afternoon! ✨";
            else if (hour >= 18 && hour < 22) dayPeriod = "🌙 Good Evening! ✨";
            else dayPeriod = "🌌 Late night vibes! ✨";

            // Rotate friendly tips
            const tips = [
                "💡 Stay productive and have a great day!",
                "💡 Take short breaks and stretch!",
                "💡 Smile! It boosts your mood!",
                "💡 Keep learning something new every day!",
                "💡 Hydrate yourself 💧"
            ];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];

            // Compose message
            const timeMessage = `
🚀 *JM-MD BOT Time Update!*

🕰️ Current time: ${time}
📆 Today is: ${day}

${dayPeriod}
${randomTip}

✨ JM-MD BOT: Shining bright and helping you grow! 🚀
`;

            await sock.sendMessage(msg.key.remoteJid, { text: timeMessage });

        } catch (err) {
            console.error("Time command error:", err);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: "⚠️ Something went wrong while fetching the time." 
            });
        }
    }
};
