module.exports = {
    name: 'quote',
    description: 'Sends a friendly motivational or funny quote',
    execute: async (msg, client) => {
        const quotes = [
            "🌟 Keep smiling! Life is better with a little joy.",
            "😊 Be yourself; everyone else is already taken. – Oscar Wilde",
            "💪 You are capable of amazing things!",
            "😄 Laughter is the best medicine, so here’s a little dose for you!",
            "🌈 Every day is a new adventure, make it count!"
        ];

        // Pick a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        // Send the quote
        await client.sendMessage(msg.from, { text: randomQuote });
    }
};
