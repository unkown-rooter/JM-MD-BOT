// index.js (fully upgraded with games loader, status reaction, and improved debug)
// Keep your commands, motto and behavior intact — upgraded for speed, safety and hot-reload.
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const os = require("os");

// ✅ AutoReply (defensive require so missing file doesn't crash)
let autoReply = null;
try {
  autoReply = require("./commands/autoreply");
} catch (e) {
  console.warn("⚠️ AutoReply module not found at ./commands/autoreply — continuing without it.");
}

// === Owner number (keep as string)
const ownerNumber = "254743445041";

// === Config
const configPath = path.join(__dirname, "data", "config.json");
let config = { autoview: false, autoreply: true };
fs.promises.readFile(configPath, "utf8")
  .then(data => { try { config = JSON.parse(data); } catch (e) { console.warn("⚠️ Invalid JSON in config.json, using defaults."); } })
  .catch(() => console.log("⚠️ No config found, using default settings."));

// === Commands directory
const commandsDir = path.join(__dirname, "commands");
const commands = new Map();

// === Cooldown system
const cooldowns = new Map();

// === Performance helper
function memUsage() {
  const m = process.memoryUsage();
  return `RSS ${(m.rss / 1024 / 1024).toFixed(1)}MB | Heap ${(m.heapUsed / 1024 / 1024).toFixed(1)}MB`;
}

// Load or reload commands (safe)
function reloadCommands() {
  const t0 = Date.now();
  commands.clear();

  // === Load normal commands (top-level .js files)
  let loaded = 0;
  if (fs.existsSync(commandsDir)) {
    try {
      const files = fs.readdirSync(commandsDir).filter(f => f.endsWith(".js"));
      for (const file of files) {
        try {
          const full = path.join(commandsDir, file);
          try { delete require.cache[require.resolve(full)]; } catch (e) {}
          const cmd = require(full);
          if (cmd?.name) {
            commands.set(cmd.name, cmd);
            loaded++;
            console.log(`🧩 Loaded command: ${cmd.name} (${file})`);
          } else {
            console.warn(`⚠️ Command file ${file} did not export a .name property, skipping.`);
          }
        } catch (err) {
          console.error(`❌ Error loading command ${file}:`, err);
        }
      }
    } catch (e) {
      console.error("❌ Failed reading commands directory:", e);
    }
  } else {
    console.warn(`⚠️ Commands directory not found: ${commandsDir}`);
  }

  // === Load games commands from subfolder "games"
  const gamesDir = path.join(commandsDir, "games");
  if (fs.existsSync(gamesDir)) {
    try {
      const gameFiles = fs.readdirSync(gamesDir).filter(f => f.endsWith(".js"));
      for (const file of gameFiles) {
        try {
          const full = path.join(gamesDir, file);
          try { delete require.cache[require.resolve(full)]; } catch (e) {}
          const cmd = require(full);
          if (cmd?.name) {
            commands.set(cmd.name, cmd);
            loaded++;
            console.log(`🎮 Loaded game command: ${cmd.name} (${path.join("games", file)})`);
          } else {
            console.warn(`⚠️ Game file ${file} did not export a .name property, skipping.`);
          }
        } catch (err) {
          console.error(`❌ Error loading game ${file}:`, err);
        }
      }
    } catch (e) {
      console.error("❌ Failed reading games directory:", e);
    }
  } // else no games folder — fine

  const took = Date.now() - t0;
  console.log(`⚡ Loaded ${commands.size} commands in ${took}ms — ${memUsage()}`);
  return { count: commands.size, took };
}

// initial load
const startTime = Date.now();
reloadCommands();

// Optional: watch commands folder and auto-reload (debounced)
let reloadTimer = null;
try {
  fs.watch(commandsDir, { persistent: false }, (ev, filename) => {
    if (!filename || !filename.endsWith(".js")) return;
    if (reloadTimer) clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => {
      console.log(`🔁 Detected command change (${filename}). Reloading commands...`);
      reloadCommands();
    }, 500);
  });
} catch (e) {
  console.warn("⚠️ Could not watch commands folder for changes:", e.message || e);
}

// Helper: owner-only check
function isOwner(sender) {
  if (!sender) return false;
  // sender may be full JID like '2547...@s.whatsapp.net' or participant; normalize
  const raw = String(sender).replace(/[^0-9]/g, ""); // digits only
  const ownerDigits = String(ownerNumber).replace(/[^0-9]/g, "");
  return raw.includes(ownerDigits);
}

// Helper: safe react
async function safeReact(sock, key, emoji = "⚡") {
  try {
    // keep original behavior — some Baileys versions accept react object like this
    await sock.sendMessage(key.remoteJid || key.participant || key, { react: { text: emoji, key } });
  } catch (e) {
    // ignore reaction errors (older clients, not supported)
  }
}

// Helper: send presence safely
async function safePresence(sock, type, jid) {
  try {
    if (typeof sock.sendPresenceUpdate === "function") {
      await sock.sendPresenceUpdate(type, jid);
    }
  } catch (e) {
    // ignore presence send errors
  }
}

// Main start function
async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  // Make socket
  const sock = makeWASocket({
    auth: state,
    browser: ["JM-MD BOT", "Chrome", "1.0"],
    syncFullHistory: false,
    markOnlineOnConnect: false,
    // note: we intentionally avoid the deprecated 'printQRInTerminal' option;
    // we handle QR via connection.update event below (and log it with qrcode).
    defaultQueryTimeoutMs: undefined
  });

  // Persist credentials
  sock.ev.on("creds.update", saveCreds);

  // Connection updates
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    // show QR (if any) using qrcode-terminal
    if (qr) {
      console.log("📌 Scan this QR to log in:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ JM-MD BOT is connected & ready!");
      console.log("💡 Motto: Strong like Samurai, Smart like Monk ⚔️🙏");
      const uptime = Date.now() - startTime;
      console.log(`⚡ Startup time: ${Math.round(uptime)}ms | Commands: ${commands.size} | ${memUsage()}`);
    }

    if (connection === "close") {
      console.warn("⚠️ Connection closed. Reason:", (lastDisconnect && lastDisconnect.error) ? (lastDisconnect.error.output?.payload || lastDisconnect.error) : "unknown");
      // If replaced (conflict), clear auth so a fresh QR is required
      try {
        const payloadType = lastDisconnect?.error?.output?.payload?.type;
        if (payloadType === "replaced" || payloadType === "override" || payloadType === "conflict") {
          console.log("⚡ Session replaced/conflict detected. Clearing auth and reconnecting...");
          try { fs.rmSync(path.join(__dirname, "auth"), { recursive: true, force: true }); } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
      // Wait a bit and restart
      setTimeout(() => {
        try { startSock(); } catch (e) { console.error("Restart error:", e); }
      }, 3000);
    }
  });

  // Messages handler
  sock.ev.on("messages.upsert", async (m) => {
    try {
      const msg = m.messages && m.messages[0];
      if (!msg) return;
      if (!msg.message) return;

      // DEBUG: show raw message key & type (useful for PM2 logs)
      try {
        console.log("📩 incoming message key:", {
          remoteJid: msg.key.remoteJid,
          id: msg.key.id,
          fromMe: msg.key.fromMe,
          participant: msg.key.participant || null,
          messageType: Object.keys(msg.message || {})[0] || "<unknown>"
        });
      } catch (e) {
        // ignore debug error
      }

      const from = msg.key.remoteJid;
      const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
      // Extra debug for body contents
      console.log("📨 message body (trimmed):", (body || "").slice(0, 100));

      let commandExecuted = false;

      // === AUTOVIEW status messages
      if (from === "status@broadcast" && config.autoview) {
        try {
          await sock.readMessages([msg.key]);
        } catch (e) {
          console.warn("⚠️ Failed to mark status read:", e?.message || e);
        }

        // Decide emoji based on content
        let emoji = "⚡"; // default
        const text = msg.message?.extendedTextMessage?.text?.toLowerCase() || "";
        if (text.includes("beautiful") || text.includes("love")) emoji = "❤️";
        else if (text.includes("nature") || text.includes("forest") || text.includes("tree")) emoji = "🌿";
        await safeReact(sock, msg.key, emoji);
        console.log(`✅ Status auto-viewed & reacted with ${emoji}`);
        return;
      }

      // === Commands starting with "."
      if (typeof body === "string" && body.startsWith(".")) {
        const args = body.slice(1).trim().split(/ +/).filter(Boolean);
        const commandName = (args.shift() || "").toLowerCase();
        if (!commandName) return;

        console.log(`⚡ Detected command: .${commandName} from ${from}`);

        const command = commands.get(commandName);
        if (!command) {
          await sock.sendMessage(from, { text: `❌ Unknown command: .${commandName}\nType .menu to see all commands.` });
          return;
        }

        // owner-only check (if command sets ownerOnly = true)
        if (command.ownerOnly && !isOwner(msg.key.participant || from)) {
          await sock.sendMessage(from, { text: "❌ This command is for the owner only." });
          return;
        }

        // cooldowns
        if (!cooldowns.has(commandName)) cooldowns.set(commandName, new Map());
        const timestamps = cooldowns.get(commandName);
        const cooldownAmount = (command.cooldown || 2) * 1000; // seconds -> ms
        const now = Date.now();
        if (timestamps.has(from)) {
          const expiration = timestamps.get(from) + cooldownAmount;
          if (now < expiration) {
            const left = ((expiration - now) / 1000).toFixed(1);
            await sock.sendMessage(from, { text: `⏳ Please wait ${left}s before using .${commandName} again.` });
            return;
          }
        }
        timestamps.set(from, now);
        setTimeout(() => timestamps.delete(from), cooldownAmount);

        // Reaction (best-effort)
        try { await safeReact(sock, msg.key, "⚡"); } catch (e) {}

        // Presence composing
        await safePresence(sock, "composing", from);

        const t0 = Date.now();
        try {
          // Pass commands Map as 4th parameter for compatibility for commands that reload/use it
          await command.execute(sock, msg, args, commands);
          commandExecuted = true;
        } catch (err) {
          console.error("Command error:", err);
          try {
            await sock.sendMessage(from, { text: "⚠️ Oops! Something went wrong executing that command." });
          } catch (e) {}
          commandExecuted = true;
        } finally {
          const took = Date.now() - t0;
          console.log(`✳️ Command .${commandName} executed in ${took}ms | ${memUsage()}`);
          await safePresence(sock, "available", from);
        }
      }

      // AutoReply for non-command messages (skip owner)
      if (!commandExecuted && !(typeof body === "string" && body.startsWith(".")) && config.autoreply && !String(from).includes(ownerNumber)) {
        if (autoReply && typeof autoReply.execute === "function") {
          try {
            await autoReply.execute(sock, msg, []);
          } catch (err) {
            console.error("AutoReply error:", err);
          }
        } else {
          // no autoreply module found — ignore
        }
      }
    } catch (e) {
      console.error("messages.upsert error:", e);
    }
  });

  console.log("⚡ JM-MD BOT is starting...");
}

startSock();
