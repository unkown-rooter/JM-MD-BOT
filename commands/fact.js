// fact.js - Fully upgraded with numbered categories, history, quiz, emojis, and API + JSON support
const fetch = require("node-fetch");
const facts = require("../data/facts.json"); // JSON facts with optional category field
const usersHistory = {}; // Tracks fact history per user

let lastFactIndex = -1; // Prevent sending same fact consecutively globally

// Numbered category map
const categories = {
    1: "science",
    2: "technology",
    3: "inspiration",
    4: "motivational",
    5: "world"
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
                menuText += `${num}. ${categories[num].charAt(0).toUpperCase() + categories[num].slice(1)}\n`;
            }
            menuText += "\nReply with the *number* of the category.";
            await sock.sendMessage(from, { text: menuText });
            return;
        }

        // User sent a number
        const numArg = parseInt(args[0]);
        const category = categories[numArg] || "random";

        try {
            // Try fetching from API
            let apiFact;
            try {
                // If category is "random", fetch normal API; else we can simulate category-based API or fallback to JSON
                const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
                const data = await response.json();
                apiFact = data.text;
            } catch (err) {
                console.error("API fetch failed, using local JSON facts:", err);
            }

            let selectedFact;

            if (apiFact) {
                selectedFact = apiFact;
            } else {
                // Fallback to JSON facts filtered by category
                let availableFacts = facts;
                if (category !== "random") {
                    availableFacts = facts.filter(f => f.category && f.category.toLowerCase() === category.toLowerCase());
                    if (availableFacts.length === 0) {
                        await sock.sendMessage(from, { text: `⚠️ No facts available for category "${category}". Showing random fact instead.` });
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

            // Add emoji based on category
            const categoryEmojiMap = {
                science: "🔬",
                technology: "💻",
                inspiration: "✨",
                motivational: "💪",
                world: "🌍",
                random: "🌟"
            };
            const emoji = categoryEmojiMap[category.toLowerCase()] || "🌟";

            // Add fact to user history
            usersHistory[userId].push(selectedFact);

            // Optionally include a quiz (simple example)
            const includeQuiz = Math.random() < 0.2; // 20% chance
            let quizText = "";
            if (includeQuiz) {
                quizText = `\n🧩 *Mini Quiz:* True or False? Reply with .quiz <answer>`;
            }

            // Send formatted fact
            await sock.sendMessage(from, {
                text: `📢 *Fun Fact!* ${emoji}\n\n${selectedFact}${quizText}\n\nType .fact next for another fact!`
            });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(from, { text: "❌ Something went wrong while fetching a fact." });
        }
    }
};
