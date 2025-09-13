module.exports = {
    name: 'quote',
    description: 'Sends a friendly motivational or funny quote',
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        const quotes = [
            "🌟 Keep smiling! Life is better with a little joy.",
            "😊 Be yourself; everyone else is already taken. – Oscar Wilde",
            "💪 You are capable of amazing things!",
            "😄 Laughter is the best medicine, so here’s a little dose for you!",
            "🌈 Every day is a new adventure, make it count!",
            "✨ Don’t wait for opportunity. Create it!",
            "🌻 Stay positive, work hard, and make it happen!",
            "😎 Keep calm and let your brilliance shine!"
        ];

        // Pick a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        // Send the quote with a friendly header
        const quoteMessage = `📝 *Friendly Quote for You:*\n${randomQuote}\n\n✨ Type .menu to explore more commands!`;

        await sock.sendMessage(from, { text: quoteMessage });
    }
};
