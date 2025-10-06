// index.js - JM-MD BOT (upgraded: hot-reload, safe exec, watchdog)
// Keep your commands, motto and behavior intact — upgraded for speed, safety and hot-reload.
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const os = require("os");
const chokidar = require("chokidar"); // install: npm i chokidar

// === Owner number (keep as string)
const ownerNumber = "254743445041";

// === Config
const configPath = path.join(__dirname, "data", "config.json");
let config = { autoview: false, autoreply: true };
fs.promises.readFile(configPath, "utf8")
  .then(data => { try { config = JSON.parse(data); } catch (e) { console.warn("⚠️ Invalid JSON in config.json, using defaults."); } })
  .catch(() => console.log("⚠️ No config found, using default settings."));

// === Commands directory & state
const commandsDir = path.join(__dirname, "commands");
let commands = new Map();

// === Cooldown system
const cooldowns = new Map();

// === tmp dir for downloads (used by apk commands etc.)
const tmpDir = path.join(__dirname, "tmp");
try { if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true }); } catch (e) { /* ignore */ }

// === Performance helper
function memUsage() {
  const m = process.memoryUsage();
  return `RSS ${(m.rss / 1024 / 1024).toFixed(1)}MB | Heap ${(m.heapUsed / 1024 / 1024).toFixed(1)}MB`;
}

const startTime = Date.now();

// ============== Safe command loader ===================
function validateCommandExport(cmd, file) {
  if (!cmd) return false;
  if (typeof cmd.execute !== "function") return false;
  if (!cmd.name) return false;
  return true;
}

function reloadCommands() {
  const t0 = Date.now();
  const newMap = new Map();

  if (!fs.existsSync(commandsDir)) {
    console.warn(`⚠️ Commands directory not found: ${commandsDir}`);
    commands = newMap;
    console.log(`⚡ Loaded ${commands.size} commands in ${Date.now() - t0}ms — ${memUsage()}`);
    return;
  }

  // collect files recursively (top-level + games)
  const walk = (dir) => {
    const files = [];
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        files.push(...walk(full));
      } else if (f.endsWith(".js")) {
        files.push(full);
      }
    }
    return files;
  };

  let loaded = 0;
  const files = walk(commandsDir);

  for (const full of files) {
    try {
      // clear from require cache and require fresh
      try { delete require.cache[require.resolve(full)]; } catch (e) {}
      const cmd = require(full);
      if (validateCommandExport(cmd, full)) {
        newMap.set(cmd.name, cmd);
        loaded++;
        // keep concise log
        console.log(`🧩 Loaded command: ${cmd.name} (${path.relative(commandsDir, full)})`);
      } else {
        console.warn(`⚠️ Invalid command (skipped): ${path.relative(commandsDir, full)}`);
      }
    } catch (err) {
      console.error(`❌ Error loading ${path.relative(commandsDir, full)}:`, err && err.stack ? err.stack.split("\n")[0] : err);
    }
  }

  commands = newMap;
  const took = Date.now() - t0;
  console.log(`⚡ Loaded ${commands.size} commands in ${took}ms — ${memUsage()}`);
  return { count: commands.size, took };
}

// initial load
reloadCommands();

// ============== File watcher (robust & debounced) ===================
const watcher = chokidar.watch(commandsDir, { ignoreInitial: true, persistent: true, depth: 3 });
let reloadPending = false;
function scheduleReload(filename) {
  if (reloadPending) return;
  reloadPending = true;
  setTimeout(() => {
    try {
      console.log(`🔁 Detected command change (${filename}). Reloading commands...`);
      reloadCommands();
    } catch (e) { console.error("Reload error:", e); }
    reloadPending = false;
  }, 500);
}

watcher
  .on("add", p => scheduleReload(p))
  .on("change", p => scheduleReload(p))
  .on("unlink", p => scheduleReload(p))
  .on("addDir", p => scheduleReload(p))
  .on("unlinkDir", p => scheduleReload(p))
  .on("error", e => console.warn("Watcher error:", e));

// ============== Helpers for runtime safety ===================
function isOwner(sender) {
  if (!sender) return false;
  const raw = String(sender).replace(/[^0-9]/g, "");
  const ownerDigits = String(ownerNumber).replace(/[^0-9]/g, "");
  return raw.includes(ownerDigits);
}

async function safeReact(sock, key, emoji = "⚡") {
  try {
    await sock.sendMessage(key.remoteJid || key.participant || key, { react: { text: emoji, key } });
  } catch (e) { /* ignore reaction errors */ }
}

async function safePresence(sock, type, jid) {
  try {
    if (typeof sock.sendPresenceUpdate === "function") {
      await sock.sendPresenceUpdate(type, jid);
    }
  } catch (e) { /* ignore */ }
}

// Execute command safely with timeout (so it cannot hang the bot)
function executeWithTimeout(command, sock, msg, args, commandsMap, opts, timeoutMs = 60_000) {
  // promise wrapper
  const p = (async () => {
    // allow command.execute to accept 3..5 args (backwards compatible)
    // preferred: (sock, msg, args, commands, opts)
    return await command.execute(sock, msg, args, commandsMap, opts);
  })();

  const timeout = new Promise((_, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Command timeout after ${timeoutMs}ms`));
    }, timeoutMs);
    // ensure if p resolves/rejects we clear timer
    p.finally(() => clearTimeout(id));
  });

  return Promise.race([p, timeout]);
}

// ============== Watchdog (memory + heartbeat) ===================
const WATCHDOG_RSS_MB = 900; // if RSS > 900MB, we will ask PM2 to restart by exiting
setInterval(() => {
  const rssMB = process.memoryUsage().rss / 1024 / 1024;
  const uptimeMin = Math.round((Date.now() - startTime) / 60000);
  console.log(`⏱ uptime ${uptimeMin}m | ${memUsage()} | commands ${commands.size}`);
  if (rssMB > WATCHDOG_RSS_MB) {
    console.error(`🚨 Memory exceeded ${WATCHDOG_RSS_MB}MB (RSS=${Math.round(rssMB)}MB). Exiting for PM2 to restart gracefully.`);
    // allow logs to flush
    setTimeout(() => process.exit(1), 1000);
  }
}, 60_000); // every minute

// Global error handlers so PM2 can restart on fatals
process.on("unhandledRejection", (reason, p) => {
  console.error("unhandledRejection:", reason && reason.stack ? reason.stack : reason);
  // Let PM2 restart the process for non-trivial rejections
});
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err && err.stack ? err.stack : err);
  // Wait a short while then exit so PM2 restarts process and we get a clean state
  setTimeout(() => process.exit(1), 1000);
});

// ============== Main socket start ===================
async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    browser: ["JM-MD BOT", "Chrome", "1.0"],
    syncFullHistory: false,
    markOnlineOnConnect: false,
    defaultQueryTimeoutMs: undefined
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("📌 Scan this QR to log in:");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "open") {
      console.log("✅ JM-MD BOT connected & ready!");
      console.log("💡 Motto: Strong like Samurai, Smart like Monk ⚔️🙏");
      console.log(`⚡ Startup: ${Date.now() - startTime}ms | Commands: ${commands.size} | ${memUsage()}`);
    }
    if (connection === "close") {
      console.warn("⚠️ Connection closed. Reason:", lastDisconnect?.error?.output?.payload || lastDisconnect?.error || "unknown");
      const payloadType = lastDisconnect?.error?.output?.payload?.type;
      if (payloadType === "replaced" || payloadType === "override" || payloadType === "conflict") {
        console.log("⚡ Session conflict - clearing auth to force re-pair");
        try { fs.rmSync(path.join(__dirname, "auth"), { recursive: true, force: true }); } catch (e) {}
      }
      setTimeout(() => {
        try { startSock(); } catch (e) { console.error("Restart error:", e); }
      }, 3000);
    }
  });

  // messages.upsert handler
  sock.ev.on("messages.upsert", async (m) => {
    try {
      const msg = m.messages && m.messages[0];
      if (!msg || !msg.message) return;

      // Debug: show message key & type
      try {
        console.log("📩 incoming message key:", {
          remoteJid: msg.key.remoteJid,
          id: msg.key.id,
          fromMe: msg.key.fromMe,
          participant: msg.key.participant || null,
          messageType: Object.keys(msg.message || {})[0] || "<unknown>"
        });
      } catch (e) {}

      const from = msg.key.remoteJid;
      const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
      console.log("📨 message body (trimmed):", (body || "").slice(0, 120));

      // auto-view status
      if (from === "status@broadcast" && config.autoview) {
        try { await sock.readMessages([msg.key]); } catch (e) { console.warn("Failed to mark status read:", e?.message || e); }
        let emoji = "⚡";
        const text = msg.message?.extendedTextMessage?.text?.toLowerCase() || "";
        if (text.includes("beautiful") || text.includes("love")) emoji = "❤️";
        else if (text.includes("nature") || text.includes("tree")) emoji = "🌿";
        await safeReact(sock, msg.key, emoji);
        console.log(`✅ Status auto-viewed & reacted with ${emoji}`);
        return;
      }

      // commands start with .
      let commandExecuted = false;
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

        if (command.ownerOnly && !isOwner(msg.key.participant || from)) {
          await sock.sendMessage(from, { text: "❌ This command is for the owner only." });
          return;
        }

        // cooldown
        if (!cooldowns.has(commandName)) cooldowns.set(commandName, new Map());
        const timestamps = cooldowns.get(commandName);
        const cooldownMs = (command.cooldown || 2) * 1000;
        const now = Date.now();
        if (timestamps.has(from)) {
          const expiration = timestamps.get(from) + cooldownMs;
          if (now < expiration) {
            const left = ((expiration - now) / 1000).toFixed(1);
            await sock.sendMessage(from, { text: `⏳ Please wait ${left}s before using .${commandName} again.` });
            return;
          }
        }
        timestamps.set(from, now);
        setTimeout(() => timestamps.delete(from), cooldownMs);

        // reaction & presence
        try { await safeReact(sock, msg.key, "⚡"); } catch (e) {}
        await safePresence(sock, "composing", from);

        const t0 = Date.now();
        try {
          // Provide options to command: tmpDir and limits (commands may accept or ignore)
          const opts = { tmpDir, maxApkMB: 120, memoryLimitMB: WATCHDOG_RSS_MB };
          // Execute with timeout to avoid hang (60s default)
          await executeWithTimeout(command, sock, msg, args, commands, opts, 60_000);
          commandExecuted = true;
        } catch (err) {
          console.error(`Command .${commandName} error:`, err && err.stack ? err.stack : err);
          try { await sock.sendMessage(from, { text: "⚠️ Oops! Something went wrong executing that command." }); } catch (e) {}
          commandExecuted = true;
        } finally {
          const took = Date.now() - t0;
          console.log(`✳️ Command .${commandName} executed in ${took}ms | ${memUsage()}`);
          await safePresence(sock, "available", from);
        }
      }

      // autoreply for non-commands
      if (!commandExecuted && !(typeof body === "string" && body.startsWith(".")) && config.autoreply && !String(from).includes(ownerNumber)) {
        try {
          const autoReplyPath = path.join(__dirname, "commands", "autoreply.js");
          if (fs.existsSync(autoReplyPath)) {
            try { delete require.cache[require.resolve(autoReplyPath)]; } catch (e) {}
            const autoReply = require(autoReplyPath);
            if (autoReply && typeof autoReply.execute === "function") {
              await autoReply.execute(sock, msg, []); // keep same signature
            }
          }
        } catch (err) {
          console.error("AutoReply error:", err);
        }
      }
    } catch (e) {
      console.error("messages.upsert handler error:", e && e.stack ? e.stack : e);
    }
  });

  console.log("⚡ JM-MD BOT is starting...");
}

startSock().catch(err => {
  console.error("Failed to start bot:", err && err.stack ? err.stack : err);
  // ensure pm2 restarts.
  setTimeout(() => process.exit(1), 1000);
});
