const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");

// ✅ Import all commands (skip autoreply here to avoid double loading)
const commands = {};
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    if (file === "autoreply.js") continue; // prevent duplicate load
    const command = require(`./commands/${file}`);
    commands[command.name] = command;
}

// ✅ Import AutoReply separately
const autoReply = require('./commands/autoreply');

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        // ✅ Command handler
        if (body.startsWith(".")) {
            const args = body.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (commands[commandName]) {
                try {
                    await commands[commandName].execute(sock, msg, args);
                } catch (err) {
                    console.error("Command error:", err);
                    await sock.sendMessage(from, { text: "⚠️ Error executing command." });
                }
            }
        }

        // ✅ Always run AutoReply after commands
        try {
            await autoReply.execute(sock, msg, []);
        } catch (err) {
            console.error("AutoReply error:", err);
        }
    });
}

startSock();
