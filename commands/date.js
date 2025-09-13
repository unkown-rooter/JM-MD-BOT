module.exports = {
  name: "date",
  description: "Show today’s date",
  execute(sock, msg, args) {
    const now = new Date();
    const date = now.toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    sock.sendMessage(msg.key.remoteJid, { text: `📅 Today is: ${date}` });
  }
};
