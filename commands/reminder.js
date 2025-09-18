// commands/reminder.js
const reminders = {}; // Store reminders per user

module.exports = {
    name: 'reminder',
    description: 'Set, list, or cancel reminders. Example: .reminder 10m Take a break',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(from, {
                text: `📌 *Reminder Usage:*
1. Set a reminder: .reminder 10m Take a break
2. List reminders: .reminder list
3. Cancel reminder: .reminder cancel <number>

━━━━━━━━━━━━━━━━
✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨`
            });
        }

        // Handle list command
        if (args[0].toLowerCase() === 'list') {
            const userReminders = reminders[from] || [];
            if (!userReminders.length) {
                return sock.sendMessage(from, { text: "✅ You have no active reminders." });
            }

            const listText = userReminders
                .map((r, i) => `${i + 1}. "${r.message}" in ${r.timeDisplay}`)
                .join("\n");

            return sock.sendMessage(from, { text: `📋 *Your Active Reminders:*\n${listText}` });
        }

        // Handle cancel command
        if (args[0].toLowerCase() === 'cancel') {
            const index = parseInt(args[1]);
            if (!index || !reminders[from] || !reminders[from][index - 1]) {
                return sock.sendMessage(from, { text: "❌ Invalid reminder number." });
            }

            const removed = reminders[from].splice(index - 1, 1)[0];
            clearTimeout(removed.timeoutId);

            return sock.sendMessage(from, { text: `✅ Cancelled reminder: "${removed.message}"` });
        }

        // Normal reminder creation
        const timeInput = args[0];
        const message = args.slice(1).join(' ');

        if (!message) {
            return sock.sendMessage(from, { text: "❌ Please type a message for your reminder. Example: .reminder 10m Take a break" });
        }

        // Parse time input
        const timeRegex = /^(\d+)(s|m|h)$/i;
        const match = timeInput.match(timeRegex);

        if (!match) {
            return sock.sendMessage(from, { text: "❌ Invalid time format. Use 10s, 5m, or 1h" });
        }

        let timeValue = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        let timeDisplay = timeInput;

        switch (unit) {
            case 's': timeValue *= 1000; break;
            case 'm': timeValue *= 60 * 1000; break;
            case 'h': timeValue *= 60 * 60 * 1000; break;
        }

        if (!reminders[from]) reminders[from] = [];

        const timeoutId = setTimeout(async () => {
            await sock.sendMessage(from, { text: `⏰ Reminder: ${message}\n\n✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨` });
            // Remove after triggering
            reminders[from] = reminders[from].filter(r => r.timeoutId !== timeoutId);
        }, timeValue);

        reminders[from].push({ message, timeoutId, timeDisplay });

        await sock.sendMessage(from, {
            text: `✅ Reminder set: "${message}" in ${timeDisplay}\nReminder #${reminders[from].length}\n\n✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨`
        });
    }
};
