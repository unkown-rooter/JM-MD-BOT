// quote.js - Fully upgraded with JSON + API support
const fetch = require("node-fetch");
const quotes = require("../data/quotes.json"); // Fallback quotes

let lastQuoteIndex = -1; // Prevent sending same quote consecutively

module.exports = {
    name: "quote",
    description: "Sends a motivational or funny quote",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        try {
            // Try fetching from ZenQuotes API
            const response = await fetch("https://zenquotes.io/api/random");
            const data = await response.json();
            const apiQuote = data[0]?.q && data[0]?.a ? `${data[0].q} — ${data[0].a}` : null;

            if (apiQuote) {
                await sock.sendMessage(from, {
                    text: `💡 *Quote (Live API)*\n\n"${apiQuote}"`
                });
                return; // API quote sent
            }
        } catch (err) {
            console.error("API fetch failed, using local JSON quotes:", err);
        }

        // Fallback to local JSON quotes
        if (!quotes || quotes.length === 0) {
            await sock.sendMessage(from, { text: "⚠️ No quotes available at the moment." });
            return;
        }

        // Pick a random quote different from last one
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * quotes.length);
        } while (randomIndex === lastQuoteIndex && quotes.length > 1);

        lastQuoteIndex = randomIndex;
        const randomQuote = quotes[randomIndex];

        await sock.sendMessage(from, {
            text: `💡 *Quote*\n\n"${randomQuote}"`
        });
    }
};
