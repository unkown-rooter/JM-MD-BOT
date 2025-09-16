// commands/time.js
module.exports = {
    name: "time",
    description: "Show the current time with extra friendly details",
    async execute(sock, msg, args) {
        try {
            const now = new Date();
            const time = now.toLocaleTimeString("en-KE", { hour12: true });
            const day = now.toLocaleDateString("en-KE", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

            // Dynamic greetings based on hour
            let dayPeriod = "";
            const hour = now.getHours();
            if (hour >= 5 && hour < 12) dayPeriod = "🌅 Good Morning!";
            else if (hour >= 12 && hour < 14) dayPeriod = "🍽️ Enjoy your lunch!";
            else if (hour >= 14 && hour < 18) dayPeriod = "☀️ Good Afternoon!";
            else if (hour >= 18 && hour < 22) dayPeriod = "🌙 Good Evening!";
            else dayPeriod = "🌌 Late night vibes!";

            // Rotate friendly tips
            const tips = [
                "💬 Tip: Stay productive and have a great day!",
                "💬 Tip: Take short breaks and stretch!",
                "💬 Tip: Smile! It boosts your mood!",
                "💬 Tip: Keep learning something new every day!",
                "💬 Tip: Hydrate yourself 💧"
            ];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];

            const timeMessage = `
🕒 Current time: ${time}
📅 Today is: ${day}
${randomTip}
${dayPeriod}
`;

            await sock.sendMessage(msg.key.remoteJid, { text: timeMessage });

        } catch (err) {
            console.error("Time command error:", err);
            await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Something went wrong while fetching the time." });
        }
    }
};
