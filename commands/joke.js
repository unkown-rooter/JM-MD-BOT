module.exports = {
    name: 'joke',
    description: 'Sends a random joke',
    execute: async (msg, client) => {
        const jokes = [
            "Why did the computer go to the doctor? Because it caught a virus! 💻🤒",
            "Why did the computer keep sneezing? It had too many windows open! 🪟😆",
            "Why did the computer get cold? Because it left its Windows open! ❄️💻",
            "Why was the computer tired when it got home? It had too many tabs open! 💤🖥️",
            "Why did the computer break up with the internet? There was too much buffering in the relationship! 💔🌐"
        ];

        // Pick a random joke
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        // Send the joke
        await client.sendMessage(msg.from, { text: randomJoke });
    }
};
