// commands/news.js
const axios = require("axios");

module.exports = {
    name: "news",
    description: "Get latest news (categories: general, technology, sports, business, entertainment, health, science) or keyword search",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const apiKey = "pub_8d98b1cc1cfb461c9565f161896d1be5"; // working NewsData.io API key
        let query = args.join(" ").trim() || "general"; // treat args as search keyword, default to general
        let articles = [];

        // --- Try fetching from API with search keyword ---
        try {
            const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&q=${encodeURIComponent(query)}&page=1`;
            const response = await axios.get(url);

            if (response.data?.results?.length > 0) {
                articles = response.data.results.slice(0, 5).map(article => ({
                    title: article.title || "No title",
                    content: article.description || article.content || "No content available",
                    url: article.link || "N/A",
                    publishedAt: article.pubDate ? new Date(article.pubDate).toLocaleString() : "N/A",
                    source: article.source_id || "Unknown"
                }));
            }
        } catch (err) {
            console.warn("❌ API fetch failed:", err.message);
        }

        // --- Fallback to general news if no articles found ---
        if (articles.length === 0 && query !== "general") {
            try {
                const fallbackUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=ke&language=en&q=general&page=1`;
                const fallbackResponse = await axios.get(fallbackUrl);

                if (fallbackResponse.data?.results?.length > 0) {
                    articles = fallbackResponse.data.results.slice(0, 5).map(article => ({
                        title: article.title || "No title",
                        content: article.description || article.content || "No content available",
                        url: article.link || "N/A",
                        publishedAt: article.pubDate ? new Date(article.pubDate).toLocaleString() : "N/A",
                        source: article.source_id || "Unknown"
                    }));
                    query = "general"; // indicate fallback
                }
            } catch (err) {
                console.warn("❌ Fallback API fetch failed:", err.message);
            }
        }

        if (articles.length === 0) {
            return sock.sendMessage(from, { text: "⚠️ No news available right now. Try again later!" });
        }

        // --- Prepare message ---
        let message = `📰 *Latest News* 📰\nSearch: *${query}*\n━━━━━━━━━━━━━━━\n`;
        articles.forEach((article, i) => {
            message += `*${i + 1}. ${article.title}*\n📝 ${article.content}\n📅 Published: ${article.publishedAt}\n🏷️ Source: ${article.source}\n🔗 Read more: ${article.url}\n━━━━━━━━━━━━━━━\n`;
        });

        message += `✨ *MOTTO:* Strong like Samurai, Smart like Monk — JM-MD BOT ⚔️🙏`;

        await sock.sendMessage(from, { text: message });
    }
};
