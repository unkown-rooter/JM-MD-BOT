module.exports = {
    name: 'fact',
    description: 'Sends a random fun fact',
    execute: async (msg, client) => {
        const facts = [
            "Did you know? Honey never spoils. Archaeologists have found 3000-year-old honey that's still edible! 🍯",
            "Did you know? Bananas are berries, but strawberries aren't! 🍌🍓",
            "Did you know? Octopuses have three hearts and blue blood! 🐙💙",
            "Did you know? A day on Venus is longer than a year on Venus! 🌌",
            "Did you know? There are more stars in the universe than grains of sand on Earth! ✨"
        ];

        // Pick a random fact
        const randomFact = facts[Math.floor(Math.random() * facts.length)];

        // Send the fact
        await client.sendMessage(msg.from, { text: randomFact });
    }
};
