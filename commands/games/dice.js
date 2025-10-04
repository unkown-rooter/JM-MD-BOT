module.exports = {
  name: "dice",
  description: "Roll a dice (1-6). Usage: .dice",
  cooldown: 2, // seconds
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    // Roll dice
    const roll = Math.floor(Math.random() * 6) + 1;

    // Dice emojis
    const diceEmojis = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const emoji = diceEmojis[roll];

    const message = `🎲 You rolled: ${roll} ${emoji}`;
    await sock.sendMessage(from, { text: message });
  }
};
