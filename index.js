// Load environment variables from .env
require('dotenv').config();

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const P = require("pino")
const figlet = require("figlet")
const chalk = require("chalk")
const qrcode = require("qrcode-terminal")
const fs = require("fs")
const path = require("path")

// Load Google API key from .env
const apiKey = process.env.GOOGLE_API_KEY;

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

    // --- Load commands dynamically ---
    const commands = new Map()
    const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"))
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        commands.set(command.name, command)
    }

    // === AUTO-VIEW STATUS ===
    async function autoViewStatus() {
        try {
            const contacts = Object.keys(sock.store.contacts) // get all contacts
            for (const id of contacts) {
                try {
                    const status = await sock.statusGet(id)
                    if (status?.statuses?.length > 0) {
                        for (const s of status.statuses) {
                            await sock.readMessages([{ remoteJid: id, id: s.id, fromMe: false }])
                        }
                        console.log(`✅ Viewed status for ${id}`)
                    }
                } catch (err) {
                    console.error(`Error viewing status for ${id}:`, err)
                }
            }
        } catch (err) {
            console.error("Auto-view status error:", err)
        }
    }
    setInterval(autoViewStatus, 5 * 60 * 1000) // run every 5 mins

    // --- Handle incoming messages ---
    sock.ev.on("messages.upsert", async m => {
        const messages = m.messages
        for (const msg of messages) {
            // Auto-read all incoming messages
            if (!msg.key.fromMe) {
                await sock.readMessages([msg.key])
            }
        }

        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid

        // Extract text from normal message or button response
        let text = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
        if (msg.message.buttonsResponseMessage) {
            text = msg.message.buttonsResponseMessage.selectedButtonId
        }

        if (!text) return
        console.log("Message received:", text)

        // === AUTO-REPLY SYSTEM ===
        if (commands.has('autoreply')) {
            try {
                await commands.get('autoreply').execute(sock, msg, apiKey) // pass apiKey if needed
            } catch (err) {
                console.error("Error in autoreply:", err)
            }
        }

        // === COMMAND HANDLER ===
        const isCommand = text.startsWith(".") || commands.has(text.replace('.', ''))
        if (isCommand) {
            const commandName = text.startsWith(".") ? text.slice(1).split(/ +/)[0].toLowerCase() : text.replace('.', '')
            const args = text.startsWith(".") ? text.slice(commandName.length + 2).trim().split(/ +/) : []

            if (commands.has(commandName)) {
                try {
                    await commands.get(commandName).execute(sock, msg, args, apiKey) // pass apiKey if needed
                } catch (err) {
                    console.error("Command error:", err)
                    await sock.sendMessage(from, { text: "❌ Error executing command" })
                }
            }
        }
    })
}

// Start the bot
startBot()
