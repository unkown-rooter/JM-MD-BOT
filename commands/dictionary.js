// commands/dictionary.js
const axios = require("axios");

let dictCounter = 0; // To number each lookup

module.exports = {
    name: "dictionary",
    description: "Look up the definition of a word 📖",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (args.length === 0) {
            await sock.sendMessage(from, { text: "📖 Usage: .dictionary <word>" });
            return;
        }

        const word = args.join(" ").toLowerCase(); // Allow multiple words

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
            const data = response.data[0];

            const meaning = data.meanings[0]?.definitions[0]?.definition || "No definition found.";
            const example = data.meanings[0]?.definitions[0]?.example || "No example available.";
            const phonetic = data.phonetic || (data.phonetics[0]?.text || "N/A");

            dictCounter++; // Increment lookup counter

            const reply = `📖 *Dictionary Lookup #${dictCounter}*\n\n🔤 Word: *${word}*\n🔊 Pronunciation: _${phonetic}_\n\n📝 Definition: ${meaning}\n💡 Example: ${example}\n\n━━━━━━━━━━━━━━━━━━\n✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨`;

            await sock.sendMessage(from, { text: reply });
        } catch (error) {
            console.error("Dictionary API error:", error);
            await sock.sendMessage(from, { text: `⚠️ Couldn’t find meaning for *${word}*.` });
        }
    }
};
