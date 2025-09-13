module.exports = {
  name: "time",
  description: "Show the current time with extra friendly details",
  execute(sock, msg, args) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-KE", { hour12: true });
    const dayPeriod = now.getHours() < 12 ? "🌅 Good Morning!" : now.getHours() < 18 ? "☀️ Good Afternoon!" : "🌙 Good Evening!";
    const day = now.toLocaleDateString("en-KE", { weekday: "long" });

    const timeMessage = `
🕒 Current time: ${time}
📅 Today is: ${day}
💬 Friendly tip: Stay productive and have a great day!
${dayPeriod}
`;

    sock.sendMessage(msg.key.remoteJid, { text: timeMessage });
  }
};
