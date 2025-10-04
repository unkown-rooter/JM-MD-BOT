require("dotenv").config();  // loads variables from config.env or deployment secrets

// Helper: convert comma-separated list to array of numbers
function parseOwners(input) {
    if (!input) return [];
    return input.split(",").map(num => num.replace(/[^0-9]/g, "")); // clean numbers
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",                       // WhatsApp session ID
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254743445041",       // Single owner fallback
    OWNERS: parseOwners(process.env.OWNERS || "254743445041"),      // ✅ Array of owners
    PREFIX: process.env.PREFIX || ".",                              // Command prefix
    BOT_NAME: process.env.BOT_NAME || "J.M-MD BOT",                 // Bot display name
    OWNER_NAME: process.env.OWNER_NAME || "*_JapaneseMonk_*",       // Bold + Italic owner name
    MOTTO: process.env.MOTTO || "We fear errors, we fear crashes, but we never stop moving forward.", // Bot motto
    MONGODB_URI: process.env.MONGODB_URI || ""                      // Optional: MongoDB URI
};
