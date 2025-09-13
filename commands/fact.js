module.exports = {
    name: 'fact',
    description: 'Sends a friendly random fun fact',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        const facts = [
            "🍯 Did you know? Honey never spoils. Archaeologists found 3000-year-old honey that’s still edible!",
            "🍌 Did you know? Bananas are berries, but strawberries aren’t!",
            "🐙 Did you know? Octopuses have three hearts and blue blood!",
            "🌌 Did you know? A day on Venus is longer than a year on Venus!",
            "✨ Did you know? There are more stars in the universe than grains of sand on Earth!",
            "🦒 Did you know? Giraffes only need 5 to 30 minutes of sleep in 24 hours!",
            "🐦 Did you know? Penguins propose to their mates with a pebble 💍🐧",
            "🌍 Did you know? Earth is the only planet not named after a god or goddess.",
            "💡 Did you know? Sharks existed before trees — over 400 million years ago!",
            "🚀 Did you know? The footprints on the moon will stay there for millions of years (no wind to erase them).",
            "🎶 Did you know? Music can help plants grow faster and healthier!",
            "😴 Did you know? Cats sleep for about 70% of their lives 🐱💤",
            "🧠 Did you know? Your brain has more connections than there are stars in our galaxy!"
        ];

        const randomFact = facts[Math.floor(Math.random() * facts.length)];

        await sock.sendMessage(from, { text: `📢 *Fun Fact!* \n\n${randomFact}` });
    }
};
