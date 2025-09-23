// commands/repo.js
module.exports = {
    name: "repo",
    description: "Show the official bot repository link",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            const buttonMessage = {
                text: `🌍 *J.M-MD BOT* Official Repository
────────────────────────────
📦 GitHub: https://github.com/unkown-rooter/JM-MD-BOT
👤 Owner : *_JapaneseMonk_*
⚡ Motto : We fear errors, we fear crashes, but we never stop moving forward.
────────────────────────────`,
                footer: "JM-MD BOT • Powered by *_JapaneseMonk_*",
                buttons: [
                    {
                        buttonId: "open_repo",
                        buttonText: { displayText: "🚀 Open Repo" },
                        type: 1,
                    },
                ],
                headerType: 1,
            };

            await sock.sendMessage(from, buttonMessage, { quoted: msg });

        } catch (e) {
            console.error("Error in repo.js:", e);
            await sock.sendMessage(msg.key.remoteJid, { text: "❌ Failed to load repository info." }, { quoted: msg });
        }
    }
};
