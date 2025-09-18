// index.js
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const path = require("path");

// ✅ AutoReply loaded once
const autoReply = require("./commands/autoreply");

// ✅ Async config (non-blocking)
const configPath = path.join(__dirname, "data", "config.json");
let config = { autoview: false };

fs.promises.readFile(configPath, "utf8")
  .then(data => {
    config = JSON.parse(data);
  })
  .catch(() => {
    console.log("⚠️ No config found, using default settings.");
  });

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  // ✅ QR + connection updates
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

  // ✅ Handle messages
  sock.ev.on("messages.upsert", async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;

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

      // ✅ Command handler
      if (body.startsWith(".")) {
        const args = body.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const commandPath = path.join(__dirname, "commands", `${commandName}.js`);
        if (fs.existsSync(commandPath)) {
          try {
            const command = require(commandPath);
            await command.execute(sock, msg, args);
          } catch (err) {
            console.error("Command error:", err);
            await sock.sendMessage(from, {
              text: "⚠️ Oops! Something went wrong executing that command.",
            });
          }
        } else {
          await sock.sendMessage(from, {
            text: `❌ Unknown command: .${commandName}\nType .menu to see all commands.`,
          });
        }
      }

      // ✅ AutoReply after commands
      try {
        await autoReply.execute(sock, msg, []);
      } catch (err) {
        console.error("AutoReply error:", err);
      }
    } catch (e) {
      console.error("messages.upsert error:", e);
    }
  });
}

startSock();
