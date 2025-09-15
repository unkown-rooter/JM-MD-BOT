// joke.js
module.exports = {
    name: 'joke',
    description: 'Sends a random funny joke',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid; // same style as riddle & quote

        const jokes = [
            "😂 Why don’t skeletons fight each other? They don’t have the guts!",
            "🤣 I told my computer I needed a break… now it won’t stop sending me Kit-Kats!",
            "😅 Why can’t your nose be 12 inches long? Because then it would be a foot!",
            "😆 What do you call fake spaghetti? An *impasta*!",
            "🙃 Why did the math book look sad? Because it had too many problems.",
            "😎 Parallel lines have so much in common… it’s a shame they’ll never meet."
        ];

        // Pick a random joke
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        // Build message
        const jokeMessage = `🎭 *Here’s a Joke for You:*\n${randomJoke}\n\n✨ Type .menu to explore more commands!`;

        await sock.sendMessage(from, { text: jokeMessage });
    }
};
