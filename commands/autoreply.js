module.exports = {
  name: 'autoreply',
  description: 'Automatic reply system for greetings',
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    const greetings = ['hi', 'hello', 'hey', 'morning', 'evening'];
    const lowerText = text.toLowerCase();

    if (greetings.some(g => lowerText.includes(g))) {
      await sock.sendMessage(from, { text: '👋 Hello! I am JM-MD BOT. Type .menu to see my commands!' });
    }
  },
};
