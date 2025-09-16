// autoreply.js - Fully upgraded with 10+ friendly features
const fs = require("fs");
const path = require("path");

// Load chats.json
const chatsPath = path.join(__dirname, "../data/chats.json");
let chats = [];
try {
    chats = JSON.parse(fs.readFileSync(chatsPath, "utf-8"));
} catch (err) {
    console.error("Error loading chats.json:", err);
}

module.exports = {
    name: 'autoreply',
    description: 'Automatically replies to chat keywords with friendly, engaging responses',
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // Safely get the message text
            const body =
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                "";

            if (!body) return;

            const text = body.toLowerCase();
            const hour = new Date().getHours();

            // 1️⃣ Time-based greetings
            if (text.includes("good morning") && hour < 12) {
                await sock.sendMessage(from, { text: "🌞 Good morning, buddy! Start your day with a fun fact: Type .fact" });
                return;
            }
            if (text.includes("good afternoon") && hour >= 12 && hour < 18) {
                await sock.sendMessage(from, { text: "☀️ Good afternoon, buddy! Need a laugh? Type .joke" });
                return;
            }
            if (text.includes("good night") && hour >= 18) {
                await sock.sendMessage(from, { text: "🌙 Good night, buddy! Sweet dreams 😴 Don’t forget to relax!" });
                return;
            }

            // 2️⃣ Emoji reactions for moods
            const moodReplies = {
                good: ["👍 That’s awesome! Keep shining 🌟", "😄 Great to hear! Type .fact for more fun!"],
                sad: ["😔 Cheer up, buddy! A joke can help: .joke", "💪 Don’t worry, tomorrow is a new day!"],
                tired: ["😴 Time to rest, buddy! Good night 🌙", "☕ Take a short break! Then try .fact to refresh!"],
                excited: ["🎉 Yay! That’s exciting! Try a riddle: .riddle", "🤩 Feeling pumped? Type .quote for motivation!"]
            };
            for (const mood in moodReplies) {
                if (text.includes(mood)) {
                    const reply = moodReplies[mood][Math.floor(Math.random() * moodReplies[mood].length)];
                    await sock.sendMessage(from, { text: reply });
                    return;
                }
            }

            // 3️⃣–8️⃣ Dynamic trigger matching using chats.json
            for (const chat of chats) {
                if (text.includes(chat.trigger.toLowerCase())) {
                    const replyText = Array.isArray(chat.reply)
                        ? chat.reply[Math.floor(Math.random() * chat.reply.length)]
                        : chat.reply;
                    await sock.sendMessage(from, { text: replyText });
                    return;
                }
            }

            // 9️⃣ Encourage daily interactions (fun fact, joke, quote)
            const dailyTips = [
                "🧠 Want to learn something new? Type .fact",
                "😂 Feeling down? Type .joke for a laugh",
                "💡 Need motivation? Type .quote",
                "🧩 Want a brain teaser? Type .riddle"
            ];
            if (Math.random() < 0.2) { // 20% chance to suggest a tip
                const tip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
                await sock.sendMessage(from, { text: tip });
                return;
            }

            // 10️⃣ Friendly fallback for unknown messages
            const fallbackReplies = [
                "🤔 I’m not sure what you mean, buddy. Try .menu to see what I can do!",
                "😅 I didn’t understand that. Type .menu to see my commands!",
                "🤖 I’m here to help! Check .menu for what I can do!"
            ];
            const fallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
            await sock.sendMessage(from, { text: fallback });

        } catch (error) {
            console.error("Error in autoreply.js:", error);
            const from = msg.key.remoteJid;
            await sock.sendMessage(from, { text: "⚠️ Oops! Something went wrong executing autoreply." });
        }
    }
};
