// riddle.js - Fully upgraded with JSON support
const riddles = require("../data/riddles.json"); // Local riddles JSON

let lastRiddleIndex = -1; // Prevent consecutive repeat

module.exports = {
    name: "riddle",
    description: "Sends a fun riddle to challenge your mind",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        if (!riddles || riddles.length === 0) {
            await sock.sendMessage(from, { text: "⚠️ No riddles available at the moment." });
            return;
        }

        // Pick a random riddle index different from last
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * riddles.length);
        } while (randomIndex === lastRiddleIndex && riddles.length > 1);

        lastRiddleIndex = randomIndex;

        const selectedRiddle = riddles[randomIndex];

        // If user types ".riddle answer", show the answer
        if (args[0] && args[0].toLowerCase() === "answer") {
            // Extract answer after "—" if using riddles.json formatted like: "Question — Answer"
            const answer = selectedRiddle.split("—")[1]?.trim() || "Answer not available";
            await sock.sendMessage(from, {
                text: `📝 *Answer:* ${answer}\n\n👉 Type *.riddle* to get a new riddle!`
            });
        } else {
            // Show riddle question
            const question = selectedRiddle.split("—")[0].trim();
            await sock.sendMessage(from, {
                text: `🤔 *Riddle Time!* 🤔\n\n${question}\n\n💡 Tip: Type *.riddle answer* to see the answer!`
            });
        }
    }
};
