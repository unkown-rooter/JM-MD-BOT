// joke.js - Fully upgraded with JSON + API support
const fetch = require("node-fetch");
const jokes = require("../data/jokes.json"); // Local fallback jokes

let lastJokeIndex = -1; // Prevent sending the same joke consecutively

module.exports = {
    name: "joke",
    description: "Sends a random funny joke",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        try {
            // Try fetching a live joke from JokeAPI
            const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
            const data = await response.json();
            const apiJoke = data.joke;

            if (apiJoke) {
                await sock.sendMessage(from, {
                    text: `😂 *Joke (Live API)*\n\n${apiJoke}`
                });
                return; // Sent API joke
            }
        } catch (err) {
            console.error("API fetch failed, using local jokes:", err);
        }

        // Fallback to local JSON jokes
        if (!jokes || jokes.length === 0) {
            await sock.sendMessage(from, { text: "⚠️ No jokes available at the moment." });
            return;
        }

        // Pick a random joke different from last one
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * jokes.length);
        } while (randomIndex === lastJokeIndex && jokes.length > 1);

        lastJokeIndex = randomIndex;
        const randomJoke = jokes[randomIndex];

        await sock.sendMessage(from, {
            text: `😂 *Joke*\n\n${randomJoke}\n\n✨ Type .menu to explore more commands!`
        });
    }
};
