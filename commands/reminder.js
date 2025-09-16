// reminder.js
module.exports = {
    name: 'reminder',
    description: 'Set a reminder after a specified time. Example: .reminder 10m Take a break',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        if (!args[0]) {
            return sock.sendMessage(from, { text: "Please specify a time. Example: .reminder 10m Take a break" });
        }

        const timeInput = args[0];
        const message = args.slice(1).join(' ');

        if (!message) {
            return sock.sendMessage(from, { text: "Please type a message for your reminder. Example: .reminder 10m Take a break" });
        }

        // Parse time input (s = seconds, m = minutes, h = hours)
        const timeRegex = /^(\d+)(s|m|h)$/i;
        const match = timeInput.match(timeRegex);

        if (!match) {
            return sock.sendMessage(from, { text: "Invalid time format. Use 10s, 5m, or 1h" });
        }

        let timeValue = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        // Convert to milliseconds
        switch (unit) {
            case 's': timeValue *= 1000; break;
            case 'm': timeValue *= 60 * 1000; break;
            case 'h': timeValue *= 60 * 60 * 1000; break;
        }

        // Confirm reminder set
        await sock.sendMessage(from, { text: `Reminder set for ${timeInput}: "${message}"` });

        // Set the timer
        setTimeout(async () => {
            await sock.sendMessage(from, { text: `⏰ Reminder: ${message}` });
        }, timeValue);
    }
};
