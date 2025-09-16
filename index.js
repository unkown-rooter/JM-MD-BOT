const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const qrcode = require("qrcode-terminal");

// ✅ Load all commands dynamically
const commands = new Map();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

// ✅ Import AutoReply separately
const autoReply = require('./commands/autoreply');

// ✅ Load config.json for Autoview toggle
let config = JSON.parse(fs.readFileSync("./data/config.json"));

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);

    // ✅ QR code & connection updates
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
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const from = msg.key.remoteJid;
            const body =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                "";

            // ✅ 🔥 AUTOVIEW FEATURE
            if (msg.key.remoteJid === "status@broadcast") {
                if (config.autoview === true) {
                    await sock.readMessages([msg.key]);
                    console.log("✅ Status auto-viewed");
                } else {
                    console.log("❌ Autoview is OFF, ignoring status");
                }
                return; // don’t process statuses as commands
            }

            // ✅ Command handler
            if (body.startsWith(".")) {
                const args = body.slice(1).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();

                if (commands.has(commandName)) {
                    try {
                        const command = commands.get(commandName);
                        // ✅ Standard execution format for all commands
                        await command.execute(sock, msg, args);
                    } catch (err) {
                        console.error("Command error:", err);
                        await sock.sendMessage(from, { text: "⚠️ Oops! Something went wrong executing that command." });
                    }
                } else {
                    await sock.sendMessage(from, { text: `❌ Unknown command: .${commandName}\nType .menu to see all commands.` });
                }
            }

            // ✅ Always run AutoReply after commands (for non-command messages)
            try {
                await autoReply.execute(sock, msg, []);
            } catch (err) {
                console.error("AutoReply error:", err);
            }
        } catch (e) {
            console.error("messages.upsert error:", e);
        }
    });

    console.log("🤖 JM-MD BOT is ready and listening for commands!");
}

startSock();
