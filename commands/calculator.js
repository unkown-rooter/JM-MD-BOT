// commands/calculator.js
const math = require('mathjs');

// In-memory store for last result per user
const lastResult = {};

module.exports = {
    name: 'calculator',
    description: 'Quick math calculations with advanced functions',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(from, { 
                text: "📊 *Calculator Usage*\nExample: `.calculator 5*12`\nSupports: +, -, *, /, %, sqrt(), sin(), cos(), tan(), log(), exp(), factorial(), pi, e, ans" 
            });
        }

        let expression = args.join(' ');

        // Replace 'ans' with previous result if user wants
        if (expression.includes('ans') && lastResult[from] !== undefined) {
            expression = expression.replace(/ans/g, `(${lastResult[from]})`);
        }

        try {
            // Evaluate safely
            const result = math.evaluate(expression);
            lastResult[from] = result;

            const reply = `
🧮 *Calculator Result*
━━━━━━━━━━━━━━━━━━
Expression: \`${expression}\`
Result: *${result}*

📚 *Math Menu:*
+ , - , * , / , %  
sqrt(x), factorial(x), exp(x), log(x)  
sin(x), cos(x), tan(x) (radians)  
Constants: pi, e  
Previous result: ans

━━━━━━━━━━━━━━━━━━
✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨
            `;

            await sock.sendMessage(from, { text: reply });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: "❌ Invalid expression. Please check your syntax and try again.\nExample: `.calculator 5*12`" 
            });
        }
    }
};
