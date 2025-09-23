// commands/news.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    name: "news",
    description: "Get latest news (supports categories: general, technology, sports, business, entertainment, health, science)",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // ✅ Determine category
        const validCategories = ["general", "technology", "sports", "business", "entertainment", "health", "science"];
        let category = args[0]?.toLowerCase() || "general";
        if (!validCategories.includes(category)) category = "general";

        let articles = [];

        // --- Step 1: Try fetching from NewsAPI.org ---
        try {
            const apiKey = "YOUR_NEWSAPI_KEY"; // replace with your NewsAPI.org key
            const url = `https://newsapi.org/v2/top-headlines?country=ke&category=${category}&pageSize=5&apiKey=${apiKey}`;

            const response = await axios.get(url);
            if (response.data?.articles?.length > 0) {
                articles = response.data.articles.map(article => ({
                    title: article.title || "No title",
                    content: article.description || "No content available",
                    url: article.url || "N/A",
                    publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : "N/A",
                    source: article.source?.name || "Unknown"
                }));
            }
        } catch (err) {
            console.warn("❌ News API fetch failed, using local cache:", err.message);
        }

        // --- Step 2: Fallback to local JSON if API fails ---
        if (articles.length === 0) {
            try {
                const newsPath = path.join(__dirname, "../data/news.json");
                const newsData = JSON.parse(fs.readFileSync(newsPath, "utf-8"));
                if (newsData && newsData.length > 0) {
                    articles = newsData.slice(0, 5).map(article => ({
                        title: article.title || "No title",
                        content: article.content || "No content available",
                        url: article.url || "N/A",
                        publishedAt: article.publishedAt || "N/A",
                        source: article.source || "Local Cache"
                    }));
                }
            } catch (err) {
                console.error("❌ Local news JSON error:", err.message);
                return sock.sendMessage(from, { text: "⚠️ Couldn’t fetch news. Try again later!" });
            }
        }

        // --- Step 3: Prepare message ---
        if (articles.length === 0) {
            return sock.sendMessage(from, { text: "⚠️ No news available right now." });
        }

        let message = `📰 *Latest News* 📰\nCategory: *${category}*\n━━━━━━━━━━━━━━━\n`;
        articles.forEach((article, i) => {
            message += `*${i + 1}. ${article.title}*\n📝 ${article.content}\n📅 Published: ${article.publishedAt}\n🏷️ Source: ${article.source}\n🔗 Read more: ${article.url}\n━━━━━━━━━━━━━━━\n`;
        });

        message += `✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨`;

        // --- Step 4: Send message ---
        await sock.sendMessage(from, { text: message });
    }
};
