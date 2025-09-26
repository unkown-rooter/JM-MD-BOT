// index.js
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const path = require("path");

// ✅ AutoReply loaded once
const autoReply = require("./commands/autoreply");

// ✅ Menu command
const menuCommand = require("./commands/menu.js");

// ✅ Async config (non-blocking)
const configPath = path.join(__dirname, "data", "config.json");
let config = { autoview: false, autoreply: true }; // added autoreply toggle

fs.promises.readFile(configPath, "utf8")
  .then(data => {
    config = JSON.parse(data);
  })
  .catch(() => {
    console.log("⚠️ No config found, using default settings.");
  });

// ✅ Preload all commands once
const commandsDir = path.join(__dirname, "commands");
const commands = new Map();
fs.readdirSync(commandsDir)
  .filter(file => file.endsWith(".js"))
  .forEach(file => {                                                                                                                            
    try {
      const cmd = require(path.join(commandsDir, file));
      if (cmd?.name) commands.set(cmd.name, cmd);
    } catch (err) {
      console.error(`❌ Error loading ${file}:`, err);
    }
  });

// === Add your number here to whitelist ===
const ownerNumber = "254743445041"; // your WhatsApp number

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;
    if (qr) {
      console.log("📌 Scan this QR to log in:");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "open") {
      console.log("✅ JM-MD BOT is connected & ready!");
    }
    if (connection === "close") {
      console.log("⚠️ Connection closed, restarting...");
      startSock(); // auto-restart
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message) return;

      const from = msg.key.remoteJid;
      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

      // 🔥 AUTOVIEW FEATURE
      if (msg.key.remoteJid === "status@broadcast") {
        if (config.autoview === true) {
          await sock.readMessages([msg.key]);
          console.log("✅ Status auto-viewed");
        } else {
          console.log("❌ Autoview is OFF, ignoring status");
        }
        return;
      }

      // ✅ Allow BOT OWNER (self) to test commands too
      const isSelf = msg.key.fromMe;

      // Track whether a command was executed
      let commandExecuted = false;

      // ✅ Handle menu number replies first
      if (menuCommand?.handleReply) {
        await menuCommand.handleReply(sock, msg);
        if (body.startsWith(".menu")) {
          commandExecuted = true; // ✅ Treat menu as executed
        }
      }

      // ✅ Command handler (commands start with .)
      if (body.startsWith(".")) {
        const args = body.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName);
        if (command) {
          try {
            await command.execute(sock, msg, args, Array.from(commands.values()));
            commandExecuted = true;
          } catch (err) {
            console.error("Command error:", err);
            await sock.sendMessage(from, {
              text: "⚠️ Oops! Something went wrong executing that command.",
            });
            commandExecuted = true;
          }
        } else {
          await sock.sendMessage(from, {
            text: `❌ Unknown command: .${commandName}\nType .menu to see all commands.`,
          });
          commandExecuted = true;
        }
      }

      // ✅ AutoReply only if:
      // 1. No command executed
      // 2. Message is NOT a command
      // 3. Auto-reply is ON
      // 4. Sender is NOT the owner
      if (
        !commandExecuted &&
        !body.startsWith(".") &&
        config.autoreply === true &&
        !from.includes(ownerNumber)
      ) {
        try {
          await autoReply.execute(sock, msg, []);
        } catch (err) {
          console.error("AutoReply error:", err);
        }
      }
    } catch (e) {
      console.error("messages.upsert error:", e);
    }
  });
}

startSock();
