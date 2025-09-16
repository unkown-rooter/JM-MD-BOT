// fact.js - Fully upgraded with categories, history, quiz, emojis, and API + JSON support
const fetch = require("node-fetch");
const facts = require("../data/facts.json"); // JSON facts with optional category field
const usersHistory = {}; // Tracks fact history per user

let lastFactIndex = -1; // Prevent sending same fact consecutively globally

module.exports = {
    name: "fact",
    description: "Sends a friendly random fun fact, with categories, history, and API fallback",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const userId = msg.key.participant || from; // unique per user

        // Initialize history for this user if needed
        if (!usersHistory[userId]) usersHistory[userId] = [];

        const categoryArg = args[0] ? args[0].toLowerCase() : "random";

        try {
            // Try fetching from API
            let apiFact;
            try {
                const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
                const data = await response.json();
                apiFact = data.text;
            } catch (err) {
                console.error("API fetch failed, using local JSON facts:", err);
            }

            if (apiFact) {
                usersHistory[userId].push(apiFact); // store in history
                await sock.sendMessage(from, {
                    text: `📢 *Fun Fact (Live API)!* \n\n${apiFact}\n\nType .fact next for another fact!`
                });
                return;
            }

            // Fallback to JSON facts
            let availableFacts = facts;
            if (categoryArg !== "random") {
                availableFacts = facts.filter(f => f.category && f.category.toLowerCase() === categoryArg);
                if (availableFacts.length === 0) {
                    await sock.sendMessage(from, { text: `⚠️ No facts available for category "${categoryArg}". Showing random fact instead.` });
                    availableFacts = facts;
                }
            }

            if (!availableFacts || availableFacts.length === 0) {
                await sock.sendMessage(from, { text: "⚠️ No facts available at the moment." });
                return;
            }

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * availableFacts.length);
            } while (randomIndex === lastFactIndex && availableFacts.length > 1);

            lastFactIndex = randomIndex;
            const randomFactObj = availableFacts[randomIndex];
            const randomFact = typeof randomFactObj === "string" ? randomFactObj : randomFactObj.text;

            // Add emojis based on category
            const categoryEmojiMap = {
                science: "🔬",
                history: "🏺",
                nature: "🌳",
                random: "🌟"
            };
            const emoji = randomFactObj.category ? categoryEmojiMap[randomFactObj.category.toLowerCase()] || "🌟" : "🌟";

            // Add fact to user history
            usersHistory[userId].push(randomFact);

            // Optionally include a quiz (simple example)
            const includeQuiz = Math.random() < 0.2; // 20% chance
            let quizText = "";
            if (includeQuiz) {
                quizText = `\n🧩 *Mini Quiz:* True or False? Reply with .quiz <answer>`;
            }

            // Send formatted fact
            await sock.sendMessage(from, {
                text: `📢 *Fun Fact!* ${emoji}\n\n${randomFact}${quizText}\n\nType .fact next for another fact!`
            });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(from, { text: "❌ Something went wrong while fetching a fact." });
        }
    }
};
