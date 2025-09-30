const fetch = require("node-fetch");

// Keep track of pagination per user
const userIndexes = {};

module.exports = {
  name: "clubmatches",
  description: "Get club football matches in categories",
  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;

      const url = "https://www.scorebat.com/video-api/v3/"; 
      const res = await fetch(url);
      const data = await res.json();

      if (!data || !data.response || !data.response.length) {
        return sock.sendMessage(jid, { text: "❌ No club matches found right now." });
      }

      const allMatches = data.response;

      // Default start at 0 if user is new
      if (!userIndexes[jid]) userIndexes[jid] = 0;

      // Get next 10 matches
      const start = userIndexes[jid];
      const end = Math.min(start + 10, allMatches.length);
      const matches = allMatches.slice(start, end);

      let reply = "⚽ *Club Matches* ⚽\n\n";

      matches.forEach((m, i) => {
        reply += `${start + i + 1}) 🏆 ${m.competition}\n`;
        reply += `   📅 ${m.date}\n`;
        reply += `   ⚔️ ${m.title}\n\n`;
      });

      // Update index for next call
      if (end >= allMatches.length) {
        userIndexes[jid] = 0; // Reset to start
        reply += "🔄 End of list. Next `.clubmatches` will restart from top.\n\n";
      } else {
        userIndexes[jid] = end; // Move to next page
        reply += `➡️ Type .clubmatches again to see more (${end}/${allMatches.length})\n\n`;
      }

      reply += "⚡ *JapaneseMonk - Fast. Simple. Powerful.*";

      await sock.sendMessage(jid, { text: reply });

    } catch (err) {
      console.error("ClubMatches error:", err);
      sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ Failed to fetch club matches. Please try again later.",
      });
    }
  },
};
