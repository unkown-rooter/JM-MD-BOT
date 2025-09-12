module.exports = {
    name: 'riddle',
    description: 'Sends a fun riddle to challenge your mind',
    execute: async (msg, client) => {
        const riddles = [
            "🧩 I speak without a mouth and hear without ears. I have nobody, but I come alive with the wind. What am I?",
            "🧩 The more you take, the more you leave behind. What am I?",
            "🧩 I’m tall when I’m young, and I’m short when I’m old. What am I?",
            "🧩 What has keys but can’t open locks?",
            "🧩 What has hands but can’t clap?"
        ];

        // Pick a random riddle
        const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];

        // Send the riddle
        await client.sendMessage(msg.from, { text: randomRiddle });
    }
};
