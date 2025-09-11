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

    // Load commands dynamically
    const commands = new Map()
    const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"))
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        commands.set(command.name, command)
    }

    // Handle incoming messages
    sock.ev.on("messages.upsert", async m => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid

        // Extract text from normal message or button response
        let text = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
        if (msg.message.buttonsResponseMessage) {
            text = msg.message.buttonsResponseMessage.selectedButtonId
        }

        if (!text) return
        console.log("Message received:", text)

        // Auto-reply system (if autoreply command exists)
        if (commands.has('autoreply')) {
            try {
                await commands.get('autoreply').execute(sock, msg)
            } catch (err) {
                console.error("Error in autoreply:", err)
            }
        }

        // Handle commands (text starting with "." or button IDs)
        const isCommand = text.startsWith(".") || commands.has(text.replace('.', ''))
        if (isCommand) {
            const commandName = text.startsWith(".") ? text.slice(1).split(/ +/)[0].toLowerCase() : text.replace('.', '')
            const args = text.startsWith(".") ? text.slice(commandName.length + 2).trim().split(/ +/) : []

            if (commands.has(commandName)) {
                try {
                    await commands.get(commandName).execute(sock, msg, args)
                } catch (err) {
                    console.error("Command error:", err)
                    await sock.sendMessage(from, { text: "❌ Error executing command" })
                }
            }
        }
    })
}

startBot()
