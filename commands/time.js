module.exports = {
  name: "time",
  description: "Show the current time",
  execute(sock, msg, args) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-KE", { hour12: true });
    sock.sendMessage(msg.key.remoteJid, { text: `🕒 Current time: ${time}` });
  }
};
