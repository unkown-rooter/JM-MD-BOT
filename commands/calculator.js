// commands/calculator.js
const math = require('mathjs');

// In-memory store for last result per user
const lastResult = {};

module.exports = {
    name: 'calculator',
    description: 'Quick math calculations with method & advanced functions',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (!args.length) {
            const menu = `
🧮 *Calculator Usage*  
━━━━━━━━━━━━━━━━━━  
Example: \`.calculator (5+3)*2\`  

📚 *Math Menu:*  
➕➖ *Basic:*  + , - , * , / , %  
📐 *Functions:*  sqrt(x), factorial(x), exp(x), log(x)  
🎯 *Trig:*  sin(x), cos(x), tan(x)  (radians)  
⚛️ *Constants:*  pi , e  
♻️ *Memory:*  ans (previous result)  

━━━━━━━━━━━━━━━━━━  
⚔️ JM-MD BOT — Strong like Samurai, Smart like Monk 🙏  
            `;
            return sock.sendMessage(from, { text: menu });
        }

        let expression = args.join(' ');

        // Replace 'ans' with previous result if user wants
        if (expression.includes('ans') && lastResult[from] !== undefined) {
            expression = expression.replace(/ans/g, `(${lastResult[from]})`);
        }

        try {
            // Parse the expression into a math tree
            const node = math.parse(expression);
            const formula = node.toString();   // shows the "method/formula"
            const result = node.evaluate();    // evaluates safely

            // Save result for this user
            lastResult[from] = result;

            const reply = `
🧮 *Calculator Result*  
━━━━━━━━━━━━━━━━━━  
📌 Expression: \`${expression}\`  
📐 Formula: \`${formula}\`  
✅ Result: *${result}*  

━━━━━━━━━━━━━━━━━━  
⚔️ JM-MD BOT — Strong like Samurai, Smart like Monk 🙏
            `;

            await sock.sendMessage(from, { text: reply });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: "❌ Invalid expression. Please check your syntax and try again.\nExample: `.calculator (5+3)*2`" 
            });
        }
    }
};
