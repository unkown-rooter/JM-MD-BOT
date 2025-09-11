const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const P = require("pino")
const figlet = require("figlet")
const chalk = require("chalk")
const qrcode = require("qrcode-terminal")
const fs = require("fs")
const path = require("path")

async function startBot() {
    console.log(chalk.green(figlet.textSync("JM-MD BOT")))

    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" })
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", update => {
        const { connection, qr } = update
        if (qr) qrcode.generate(qr, { small: true })
        if (connection === "open") console.log("✅ JM-MD BOT Connected!")
    })

    // Load commands
    const commands = new Map()
    const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"))
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        commands.set(command.name, command)
    }

    // Handle messages
    sock.ev.on("messages.upsert", async m => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return // ignore empty or self messages
        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (!text) return

        console.log("Message:", text)

        // === AUTO-REPLY SYSTEM ===
        if (commands.has('autoreply')) {
            const command = commands.get('autoreply')
            await command.execute(sock, msg)
        }

        // === COMMAND HANDLER (for commands starting with '.') ===
        if (text.startsWith(".")) {
            const args = text.slice(1).trim().split(/ +/)
            const commandName = args.shift().toLowerCase()

            if (commands.has(commandName)) {
                try {
                    await commands.get(commandName).execute(sock, from, args)
                } catch (err) {
                    console.error(err)
                    await sock.sendMessage(from, { text: "❌ Error executing command" })
                }
            }
        }
    })
}

startBot()
