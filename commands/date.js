module.exports = {
  name: "date",
  description: "Show today’s date with extra details",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const now = new Date();

    // Format main date
    const date = now.toLocaleDateString("en-KE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Extra features
    const weekNumber = Math.ceil(((now - new Date(now.getFullYear(), 0, 1)) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dateMessage = `
📅 *Today's Date Info*

🗓️ Date: ${date}
📌 Week Number: ${weekNumber}
🌍 Timezone: ${timezone}

✨ Make today count, buddy!
    `;

    await sock.sendMessage(from, { text: dateMessage });
  }
};
