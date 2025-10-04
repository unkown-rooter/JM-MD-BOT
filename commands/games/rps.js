module.exports = {
  name: "rps",
  description: "Play Rock-Paper-Scissors with the bot. Usage: .rps rock|paper|scissors",
  cooldown: 3, // seconds
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const playerChoice = args[0]?.toLowerCase();

    if (!playerChoice || !["rock", "paper", "scissors"].includes(playerChoice)) {
      return sock.sendMessage(from, { text: "❌ Please choose rock, paper, or scissors. Example: .rps rock" });
    }

    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = "";
    if (playerChoice === botChoice) result = "🤝 It's a tie!";
    else if (
      (playerChoice === "rock" && botChoice === "scissors") ||
      (playerChoice === "paper" && botChoice === "rock") ||
      (playerChoice === "scissors" && botChoice === "paper")
    ) result = "🎉 You win!";
    else result = "😢 You lose!";

    const message = `🧑 You chose: ${playerChoice}\n🤖 Bot chose: ${botChoice}\n${result}`;
    await sock.sendMessage(from, { text: message });
  }
};
