// config.js
require("dotenv").config();  // loads variables from config.env or deployment secrets

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",                // WhatsApp session ID (paste after generating)
    OWNER_NUMBER: process.env.OWNER_NUMBER || "+254743445041", // Owner WhatsApp number
    PREFIX: process.env.PREFIX || ".",                        // Command prefix
    BOT_NAME: process.env.BOT_NAME || "J.M-MD BOT",          // Bot display name
    OWNER_NAME: process.env.OWNER_NAME || "*_JapaneseMonk_*", // Bold + Italic owner name
    MOTTO: process.env.MOTTO || "We fear errors, we fear crashes, but we never stop moving forward.", // Bot motto
    MONGODB_URI: process.env.MONGODB_URI || ""               // Optional: MongoDB URI if needed
};
