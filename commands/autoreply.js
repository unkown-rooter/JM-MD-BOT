const fs = require('fs');
const repliesPath = './autoreplies.json';
const statusPath = './autoreply-status.json';

// Ensure autoreplies.json exists
if (!fs.existsSync(repliesPath)) fs.writeFileSync(repliesPath, JSON.stringify({}));

// Ensure status file exists
if (!fs.existsSync(statusPath)) fs.writeFileSync(statusPath, JSON.stringify({ enabled: true }));

module.exports = {
    name: 'autoreply',
    description: 'Dynamic auto-reply system with ON/OFF toggle',
    async execute(client, message) {
        const text = message.message.conversation?.toLowerCase() || message.message.extendedTextMessage?.text?.toLowerCase();
        if (!text) return;

        const data = JSON.parse(fs.readFileSync(repliesPath));
        const status = JSON.parse(fs.readFileSync(statusPath));

        // === TOGGLE AUTO-REPLY ===
        if (text === '.autoreply on') {
            status.enabled = true;
            fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
            await client.sendMessage(message.key.remoteJid, { text: '✅ Auto-reply is now ON' });
            return;
        }
        if (text === '.autoreply off') {
            status.enabled = false;
            fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
            await client.sendMessage(message.key.remoteJid, { text: '❌ Auto-reply is now OFF' });
            return;
        }

        // === ADD NEW REPLY ===
        if (text.startsWith('.addreply ')) {
            const content = text.replace('.addreply ', '');
            const [keyword, response] = content.split('|');
            if (!keyword || !response) {
                await client.sendMessage(message.key.remoteJid, { text: 'Format: .addreply keyword|response' });
                return;
            }
            data[keyword.trim()] = response.trim();
            fs.writeFileSync(repliesPath, JSON.stringify(data, null, 2));
            await client.sendMessage(message.key.remoteJid, { text: `✅ Added auto-reply: "${keyword}" → "${response}"` });
            return;
        }

        // === AUTO-REPLY LOGIC ===
        if (!status.enabled) return; // skip if turned off
        for (let keyword in data) {
            if (text.includes(keyword.toLowerCase())) {
                await client.sendMessage(message.key.remoteJid, { text: data[keyword] });
                break;
            }
        }
    }
};
