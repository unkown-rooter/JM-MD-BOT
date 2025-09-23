// commands/group.js
// ⚡ JM-MD BOT GROUP FEATURES ⚡
// MOTTO: We fear errors, we fear crashes, but we never stop moving forward.

module.exports = {
    name: 'group',
    description: 'Group management commands: promote, demote, add, kick, mute, unmute, tagall',

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;
            const isGroup = from.endsWith('@g.us');

            if (!isGroup) {
                await sock.sendMessage(from, { text: '❌ This command works only in groups!' }, { quoted: msg });
                return;
            }

            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const senderIsAdmin = participants.find(p => p.id === sender && p.admin !== null);

            if (!senderIsAdmin) {
                await sock.sendMessage(from, { text: '❌ Only admins can use group management commands!' }, { quoted: msg });
                return;
            }

            const command = args[0]?.toLowerCase();

            switch (command) {
                case 'promote': {
                    const user = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                    if (!user) return sock.sendMessage(from, { text: '⚠️ Mention the user to promote!' }, { quoted: msg });
                    await sock.groupParticipantsUpdate(from, [user], 'promote');
                    await sock.sendMessage(from, { text: `✅ User promoted: @${user.split('@')[0]}`, mentions: [user] }, { quoted: msg });
                    break;
                }

                case 'demote': {
                    const user = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                    if (!user) return sock.sendMessage(from, { text: '⚠️ Mention the user to demote!' }, { quoted: msg });
                    await sock.groupParticipantsUpdate(from, [user], 'demote');
                    await sock.sendMessage(from, { text: `✅ User demoted: @${user.split('@')[0]}`, mentions: [user] }, { quoted: msg });
                    break;
                }

                case 'kick': {
                    const user = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                    if (!user) return sock.sendMessage(from, { text: '⚠️ Mention the user to kick!' }, { quoted: msg });
                    await sock.groupParticipantsUpdate(from, [user], 'remove');
                    await sock.sendMessage(from, { text: `✅ User removed: @${user.split('@')[0]}`, mentions: [user] }, { quoted: msg });
                    break;
                }

                case 'add': {
                    const number = args[1];
                    if (!number) return sock.sendMessage(from, { text: '⚠️ Provide a number to add!\nExample: .group add 2547xxxxxxx' }, { quoted: msg });
                    const user = `${number}@s.whatsapp.net`;
                    await sock.groupParticipantsUpdate(from, [user], 'add');
                    await sock.sendMessage(from, { text: `✅ Added user: @${number}`, mentions: [user] }, { quoted: msg });
                    break;
                }

                case 'mute': {
                    await sock.groupSettingUpdate(from, 'announcement');
                    await sock.sendMessage(from, { text: '🔒 Group has been muted (only admins can send messages).' }, { quoted: msg });
                    break;
                }

                case 'unmute': {
                    await sock.groupSettingUpdate(from, 'not_announcement');
                    await sock.sendMessage(from, { text: '🔓 Group has been unmuted (everyone can send messages).' }, { quoted: msg });
                    break;
                }

                case 'tagall': {
                    let text = '📢 *Tagging all members:*\n\n';
                    for (let p of participants) {
                        text += `👉 @${p.id.split('@')[0]}\n`;
                    }
                    await sock.sendMessage(from, { text, mentions: participants.map(p => p.id) }, { quoted: msg });
                    break;
                }

                default:
                    await sock.sendMessage(from, { text: '⚡ Group Commands:\n.group promote @user\n.group demote @user\n.group kick @user\n.group add 2547xxxxxxx\n.group mute\n.group unmute\n.group tagall' }, { quoted: msg });
            }

        } catch (err) {
            console.error('❌ Group command error:', err);
            await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Error in group command. Check logs.' }, { quoted: msg });
        }
    }
};
