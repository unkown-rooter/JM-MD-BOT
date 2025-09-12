module.exports = {
    name: 'joke',
    description: 'Sends a friendly random joke',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        const jokes = [
            "😄 Why did the computer go to the doctor? It caught a virus!",
            "😂 Why was the computer cold? It left its Windows open!",
            "🤣 Why did the programmer quit his job? He didn't get arrays.",
            "😆 Why did the computer keep sneezing? It had a bad case of ‘code’ allergies!"
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        await sock.sendMessage(from, { text: randomJoke });
    }
};
