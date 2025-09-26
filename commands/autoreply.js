// autoreply.js - Spam-proof, only one reply per message
const fs = require("fs");
const path = require("path");

// Paths to your data files
const chatsPath = path.join(__dirname, "../data/chats.json");
const autorepliesPath = path.join(__dirname, "../autoreplies.json");
const statusPath = path.join(__dirname, "../autoreply-status.json");

// Load chats.json
let chats = [];
try {
    chats = JSON.parse(fs.readFileSync(chatsPath, "utf-8"));
} catch (err) {
    console.error("Error loading chats.json:", err);
}

// Load autoreplies.json
let autoreplies = [];
try {
    autoreplies = JSON.parse(fs.readFileSync(autorepliesPath, "utf-8"));
} catch (err) {
    console.error("Error loading autoreplies.json:", err);
}

// Load autoreply-status.json
let autoreplyStatus = {};
try {
    autoreplyStatus = JSON.parse(fs.readFileSync(statusPath, "utf-8"));
} catch (err) {
    console.log("No autoreply status file found, starting fresh.");
}

module.exports = {
    name: 'autoreply',
    description: 'Automatically replies to chat keywords with friendly, engaging responses',
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
            if (!body || body.startsWith(".")) return; // Ignore commands

            const text = body.toLowerCase();
            const hour = new Date().getHours();

            // ✅ Only one reply per message
            let replied = false;

            // 1️⃣ Time-based greetings
            if (!replied && text.includes("good morning") && hour < 12) {
                await sock.sendMessage(from, { text: "🌞 Good morning, buddy! Start your day with a fun fact: Type .fact" });
                replied = true;
            } else if (!replied && text.includes("good afternoon") && hour >= 12 && hour < 18) {
                await sock.sendMessage(from, { text: "☀️ Good afternoon, buddy! Need a laugh? Type .joke" });
                replied = true;
            } else if (!replied && text.includes("good night") && hour >= 18) {
                await sock.sendMessage(from, { text: "🌙 Good night, buddy! Sweet dreams 😴" });
                replied = true;
            }

            // 2️⃣ Mood-based replies
            const moods = {
                good: ["👍 That’s awesome! Keep shining 🌟", "😄 Great to hear! Type .fact for more fun!"],
                sad: ["😔 Cheer up, buddy! A joke can help: .joke", "💪 Don’t worry, tomorrow is a new day!"],
                tired: ["😴 Time to rest, buddy! Good night 🌙", "☕ Take a short break! Then try .fact to refresh!"],
                excited: ["🎉 Yay! That’s exciting! Try a riddle: .riddle", "🤩 Feeling pumped? Type .quote for motivation!"]
            };
            for (const mood in moods) {
                if (!replied && text.includes(mood)) {
                    const reply = moods[mood][Math.floor(Math.random() * moods[mood].length)];
                    await sock.sendMessage(from, { text: reply });
                    replied = true;
                    break;
                }
            }

            // 3️⃣ Chats triggers from chats.json
            for (const chat of chats) {
                if (!replied && text.includes(chat.trigger.toLowerCase())) {
                    const replyText = Array.isArray(chat.reply)
                        ? chat.reply[Math.floor(Math.random() * chat.reply.length)]
                        : chat.reply;
                    await sock.sendMessage(from, { text: replyText });
                    replied = true;
                    break;
                }
            }

            // 4️⃣ Autoreplies.json triggers
            for (const ar of autoreplies) {
                if (!replied && text.includes(ar.trigger.toLowerCase())) {
                    const replyText = Array.isArray(ar.reply)
                        ? ar.reply[Math.floor(Math.random() * ar.reply.length)]
                        : ar.reply;
                    await sock.sendMessage(from, { text: replyText });
                    replied = true;
                    break;
                }
            }

            // 5️⃣ Daily tips (20% chance)
            if (!replied && Math.random() < 0.2) {
                const tips = [
                    "🧠 Want to learn something new? Type .fact",
                    "😂 Feeling down? Type .joke for a laugh",
                    "💡 Need motivation? Type .quote",
                    "🧩 Want a brain teaser? Type .riddle"
                ];
                const tip = tips[Math.floor(Math.random() * tips.length)];
                await sock.sendMessage(from, { text: tip });
                replied = true;
            }

            // 6️⃣ Friendly fallback
            if (!replied) {
                const fallback = [
                    "🤔 I’m not sure what you mean, buddy. Try .menu to see what I can do!",
                    "😅 I didn’t understand that. Type .menu to see my commands!",
                    "🤖 I’m here to help! Check .menu for what I can do!"
                ];
                const fb = fallback[Math.floor(Math.random() * fallback.length)];
                await sock.sendMessage(from, { text: fb });
                replied = true;
            }

            // ✅ Optional: Save autoreplyStatus to prevent repetition
            autoreplyStatus[from] = body;
            fs.writeFileSync(statusPath, JSON.stringify(autoreplyStatus, null, 2));

        } catch (error) {
            console.error("Error in autoreply.js:", error);
            const from = msg.key.remoteJid;
            await sock.sendMessage(from, { text: "⚠️ Oops! Something went wrong executing autoreply." });
        }
    }
};
