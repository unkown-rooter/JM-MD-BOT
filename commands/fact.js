// commands/fact.js - Fully upgraded JM-MD BOT version with emoji categories
const fetch = require("node-fetch");
const facts = require("../data/facts.json"); // local JSON facts with optional category
const usersHistory = {}; // Tracks fact history per user

let lastFactIndex = -1; // Prevent sending the same fact consecutively globally

// Numbered category map with emojis
const categories = {
    1: { name: "Science & Technology", key: "science_technology", emoji: "🔬💻" },
    2: { name: "History & Culture", key: "history_culture", emoji: "🏛️📜" },
    3: { name: "Geography & Travel", key: "geography_travel", emoji: "🌍✈️" },
    4: { name: "Sports & Entertainment", key: "sports_entertainment", emoji: "⚽🎬" },
    5: { name: "Miscellaneous", key: "miscellaneous", emoji: "🌟" }
};

module.exports = {
    name: "fact",
    description: "Sends a friendly random fun fact, with categories, history, and API fallback",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const userId = msg.key.participant || from; // unique per user

        // Initialize history for this user if needed
        if (!usersHistory[userId]) usersHistory[userId] = [];

        // No argument? Show numbered category menu
        if (!args[0]) {
            let menuText = "📚 *Choose a category:*\n\n";
            for (let num in categories) {
                menuText += `${num}. ${categories[num].emoji} ${categories[num].name}\n`;
            }
            menuText += "\nReply with the *number* of the category.";
            await sock.sendMessage(from, { text: menuText });
            return;
        }

        // User sent a number
        const numArg = parseInt(args[0]);
        const categoryObj = categories[numArg];
        const categoryKey = categoryObj ? categoryObj.key : "random";
        const categoryEmoji = categoryObj ? categoryObj.emoji : "🌟";

        try {
            // 1️⃣ Try fetching from API
            let apiFact;
            try {
                const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
                const data = await response.json();
                apiFact = data.text;
            } catch (err) {
                console.error("API fetch failed, using local JSON facts:", err);
            }

            // 2️⃣ Pick fact from API or JSON
            let selectedFact;
            if (apiFact) {
                selectedFact = apiFact;
            } else {
                // Fallback to JSON facts filtered by category
                let availableFacts = facts;
                if (categoryKey !== "random") {
                    availableFacts = facts.filter(f => f.category && f.category.toLowerCase() === categoryKey.toLowerCase());
                    if (availableFacts.length === 0) {
                        await sock.sendMessage(from, { text: `⚠️ No facts available for category "${categoryObj.name}". Showing random fact instead.` });
                        availableFacts = facts;
                    }
                }

                if (!availableFacts || availableFacts.length === 0) {
                    await sock.sendMessage(from, { text: "⚠️ No facts available at the moment." });
                    return;
                }

                // Pick random fact avoiding last global fact
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * availableFacts.length);
                } while (randomIndex === lastFactIndex && availableFacts.length > 1);

                lastFactIndex = randomIndex;
                const randomFactObj = availableFacts[randomIndex];
                selectedFact = typeof randomFactObj === "string" ? randomFactObj : randomFactObj.text;
            }

            // 3️⃣ Add fact to user history
            usersHistory[userId].push(selectedFact);

            // 4️⃣ Optionally include a mini quiz (20% chance)
            const includeQuiz = Math.random() < 0.2; // 20% chance
            let quizText = "";
            if (includeQuiz) {
                quizText = `\n🧩 *Mini Quiz:* True or False? Reply with .quiz <answer>`;
            }

            // 5️⃣ Send formatted fact
            await sock.sendMessage(from, {
                text: `📢 *Fun Fact!* ${categoryEmoji}\n\n${selectedFact}${quizText}\n\nType .fact next for another fact!`
            });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(from, { text: "❌ Something went wrong while fetching a fact." });
        }
    }
};
