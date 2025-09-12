module.exports = {
    name: 'riddle',
    description: 'Sends a fun riddle to challenge your mind',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        // Riddles array with answers
        const riddles = [
            { question: "🧩 I speak without a mouth and hear without ears. I have nobody, but I come alive with the wind. What am I?", answer: "An echo" },
            { question: "🧩 The more you take, the more you leave behind. What am I?", answer: "Footsteps" },
            { question: "🧩 I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "A candle" },
            { question: "🧩 What has keys but can’t open locks?", answer: "A piano" },
            { question: "🧩 What has hands but can’t clap?", answer: "A clock" }
        ];

        // Pick a random riddle
        const selected = riddles[Math.floor(Math.random() * riddles.length)];

        // If user types ".riddle answer", show the answer
        if (args[0] && args[0].toLowerCase() === "answer") {
            await sock.sendMessage(from, { text: `📝 Answer: ${selected.answer}` });
        } else {
            await sock.sendMessage(from, { text: selected.question + "\n\n_Type .riddle answer to see the answer_" });
        }
    }
};
