module.exports = {
    name: 'joke',
    description: 'Sends a friendly random joke',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        const jokes = [
            "😄 Why did the computer go to the doctor? It caught a virus!",
            "😂 Why was the computer cold? It left its Windows open!",
            "🤣 Why did the programmer quit his job? He didn't get arrays.",
            "😆 Why did the computer keep sneezing? It had a bad case of ‘code’ allergies!",
            "🐸 Why are frogs so happy? Because they eat whatever bugs them!",
            "🍌 Why did the banana go to the doctor? Because it wasn't peeling well!",
            "🤖 Why did the robot go on a diet? Because he had too many bytes!",
            "👻 Why don't ghosts like rain? It dampens their spirits!",
            "🦄 Why did the unicorn cross the road? To prove he wasn’t horsing around!"
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        await sock.sendMessage(from, { text: `🎉 *Joke Time!* \n\n${randomJoke}` });
    }
};
