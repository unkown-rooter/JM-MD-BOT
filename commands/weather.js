// commands/w.js
const axios = require("axios");

module.exports = {
    name: "w",
    description: "Get current weather for a city",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const city = args.length > 0 ? args.join(" ") : "Nairobi"; // default Nairobi
        const apiKey = "8eb3e3c396512105c8733221352ba33a"; // ✅ your OpenWeather API key

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
            const res = await axios.get(url);

            if (!res.data || !res.data.main) {
                await sock.sendMessage(from, { text: `⚠️ Couldn't fetch weather for *${city}*.` });
                return;
            }

            const temp = res.data.main.temp;
            const feelsLike = res.data.main.feels_like;
            const desc = res.data.weather[0].description;

            const message = `
🌦️ *Weather Update for ${city}* 🌦️
🌡️ Temp: *${temp}°C*
🥶 Feels Like: *${feelsLike}°C*
📝 Condition: *${desc}*

━━━━━━━━━━━━━━━
🤖 *JM-MD BOT* — We fear errors, we fear crashes, but we never stop moving forward.
            `;

            await sock.sendMessage(from, { text: message });
        } catch (err) {
            console.error("❌ Weather API error:", err.message);
            await sock.sendMessage(from, { text: `⚠️ Oops! Couldn't fetch weather for *${city}* right now.` });
        }
    }
};
