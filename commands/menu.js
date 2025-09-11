module.exports = {
    name: 'autoreply', // must match filename
    description: 'Automatically replies to messages',
    async execute(sock, msg, args = [], apiKey) {
        const from = msg.key.remoteJid;

        // Example: log apiKey to confirm it's loaded
        console.log("✅ Using API key in autoreply:", apiKey ? "Yes" : "No");

        // Your existing autoreply logic here
    }
}
