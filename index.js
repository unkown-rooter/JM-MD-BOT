const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const P = require("pino")
const figlet = require("figlet")
const chalk = require("chalk")
const qrcode = require("qrcode-terminal")

async function startBot() {
    console.log(chalk.green(figlet.textSync("JM-MD BOT")))

    // Load latest version
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" }),
        printQRInTerminal: true   // 👈 forces QR code to show
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update
        if (qr) {
            qrcode.generate(qr, { small: true }) // 👈 shows QR in Termux
        }
        if (connection === "open") {
            console.log("✅ JM-MD BOT Connected!")
        }
    })

    sock.ev.on("messages.upsert", async m => {
        const msg = m.messages[0]
        if (!msg.message) return
        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (text) {
            console.log("Message:", text)

            if (text === ".menu") {
                await sock.sendMessage(from, { text: "Hello, I am JM-MD BOT 🤖\nAvailable commands: .menu, .ping" })
            }

            if (text === ".ping") {
                await sock.sendMessage(from, { text: "🏓 Pong!" })
            }
        }
    })
}

startBot()
