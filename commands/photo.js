// commands/photo.js
const axios = require("axios");

module.exports = {
    name: "photo",
    description: "Fetch a photo from Pixabay (usage: .photo <search term>)",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // Pixabay API key (replace if you get a personal one)
        const apiKey = "52348099-eff09a539f4e5148a6ebd430d";
        const query = args.length > 0 ? args.join(" ") : "nature";

        try {
            // Call Pixabay API
            const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true`;
            const response = await axios.get(url);

            if (response.data && response.data.hits && response.data.hits.length > 0) {
                // Pick a random image from results
                const randomIndex = Math.floor(Math.random() * response.data.hits.length);
                const photo = response.data.hits[randomIndex];

                // Send image with caption
                await sock.sendMessage(from, {
                    image: { url: photo.webformatURL },
                    caption: `📸 *Photo result for:* ${query}\n👤 By: ${photo.user}\n👍 ${photo.likes} Likes | 💾 ${photo.downloads} Downloads\n🔗 Source: ${photo.pageURL}`
                }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: `❌ No results found for *${query}*.` }, { quoted: msg });
            }

        } catch (error) {
            console.error("Pixabay API error:", error.response?.data || error.message);

            await sock.sendMessage(from, {
                text: `⚠️ Oops! Failed to fetch photo.\n\n🛠️ Error: ${error.response?.data || error.message}`
            }, { quoted: msg });
        }
    }
};
