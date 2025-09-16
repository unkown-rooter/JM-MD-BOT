// calculator.js
const math = require('mathjs');

module.exports = {
    name: 'calculator',
    description: 'Quick math calculations',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        // Join the arguments to form the expression
        const expression = args.join(' ');

        if (!expression) {
            return sock.sendMessage(from, { text: "Please provide a math expression. Example: .calculator 5*12" });
        }

        try {
            // Evaluate the expression safely
            const result = math.evaluate(expression);

            // Send the result back to the user
            await sock.sendMessage(from, { text: `Result: ${result}` });
        } catch (error) {
            // Handle invalid expressions
            await sock.sendMessage(from, { text: "Oops! Invalid expression. Please try again." });
        }
    }
};
