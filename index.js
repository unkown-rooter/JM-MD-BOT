const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const qrcode = require("qrcode-terminal"); // ✅ Added for QR printing

// ✅ Import all commands (skip autoreply here to avoid double loading)
const commands = {};
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    if (file === "autoreply.js") continue; // prevent duplicate load
    const command = require(`./commands/${file}`);
    commands[command.name] = command;
}

// ✅ Ensure ping.js is connected
// If ping.js exists in ./commands, it is already included above

// ✅ Import AutoReply separately
const autoReply = require('./commands/autoreply');

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);

    // ✅ NEW: Show QR code and connection status
    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log("📌 Scan this QR to log in:");
            qrcode.generate(qr, { small: true });
        }
        if (connection === "open") {
            console.log("✅ JM-MD BOT is connected to WhatsApp!");
        }
        if (connection === "close") {
            console.log("⚠️ Connection closed, restarting...");
            startSock(); // auto-restart
        }
    });

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
