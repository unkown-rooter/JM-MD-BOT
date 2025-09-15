module.exports = {
    name: "quote",
    description: "Sends a motivational or funny quote",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const quotes = [
            { text: "🌟 Keep smiling! Life is better with a little joy.", author: "Unknown" },
            { text: "😊 Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
            { text: "💪 You are capable of amazing things!", author: "Unknown" },
            { text: "😄 Laughter is the best medicine, so here’s a little dose for you!", author: "Unknown" },
            { text: "🌈 Every day is a new adventure, make it count!", author: "Unknown" },
            { text: "✨ Don’t wait for opportunity. Create it!", author: "Unknown" },
            { text: "🌻 Stay positive, work hard, and make it happen!", author: "Unknown" },
            { text: "😎 Keep calm and let your brilliance shine!", author: "Unknown" }
        ];

        // Pick a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        // Send formatted message
        const quoteMessage = `📖 *Quote of the Moment* 📖\n\n"${randomQuote.text}"\n\n— ${randomQuote.author}`;

        await sock.sendMessage(from, { text: quoteMessage });
    }
};
