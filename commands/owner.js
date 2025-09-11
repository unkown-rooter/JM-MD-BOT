module.exports = {
    name: 'owner',
    description: 'Shows owner information',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: '👤 *Owner Info*\nName: JapaneseMonk\nPhone: +254743445041\nRole: Developer & CEO' });
    },
};
