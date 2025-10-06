// commands/apk.js
// JM-MD BOT APK Downloader Command
// Motto: Strong like Samurai, Smart like Monk ⚔️🙏

const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "apk",
  description: "Download APK from multiple open sources + RapidAPI backup",
  cooldown: 5,

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const query = args.join(" ");
    if (!query) {
      return sock.sendMessage(from, {
        text: "📦 Please provide an app name.\nExample: `.apk WhatsApp`",
      });
    }

    await sock.sendMessage(from, { text: `🔍 Searching for "${query}"...` });

    try {
      // === 1️⃣ Try APKCombo ===
      const comboUrl = `https://apkcombo.com/en/search/?q=${encodeURIComponent(query)}`;
      const comboRes = await axios.get(comboUrl, { timeout: 10000 });
      const $ = cheerio.load(comboRes.data);
      const firstApp = $(".app-item").first();

      if (firstApp.length) {
        const title = firstApp.find(".app-name").text().trim();
        const link = "https://apkcombo.com" + firstApp.find("a").attr("href");
        const icon = firstApp.find("img").attr("src");

        await sock.sendMessage(from, {
          image: { url: icon },
          caption: `🧩 *${title}*\n🔗 [APKCombo Link](${link})\n\n⚔️ Motto: Strong like Samurai, Smart like Monk.`,
        });
        return;
      }
    } catch (e) {
      console.warn("APKCombo failed:", e.message);
    }

    try {
      // === 2️⃣ Try APKMirror fallback (Upgraded Section with direct clickable open) ===
      const mirrorUrl = `https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=${encodeURIComponent(query)}`;
      const mirrorRes = await axios.get(mirrorUrl, { timeout: 10000 });
      const $$ = cheerio.load(mirrorRes.data);

      // Extract the first app card properly
      const firstAppLink = $$(".appRow .downloadLink").first().attr("href") 
                        || $$(".appRow a").first().attr("href");

      if (firstAppLink) {
        const fullLink = `https://www.apkmirror.com${firstAppLink}`;
        const appTitle = $$(".appRowTitle").first().text().trim() || query;

        await sock.sendMessage(from, {
          text: `📱 *${appTitle}*\n👉 [Open on APKMirror](${fullLink})\n\n⚔️ Motto: Strong like Samurai, Smart like Monk.`,
          linkPreview: true,
        });
        return;
      }
    } catch (e) {
      console.warn("APKMIRROR failed:", e.message);
    }

    try {
      // === 3️⃣ Try Softonic fallback ===
      const softonicUrl = `https://en.softonic.com/s/${encodeURIComponent(query)}`;
      const softRes = await axios.get(softonicUrl, { timeout: 10000 });
      const $$$ = cheerio.load(softRes.data);
      const firstSoft = $$$("article").first();

      if (firstSoft.length) {
        const title = firstSoft.find("h2").text().trim();
        const link = "https://en.softonic.com" + firstSoft.find("a").attr("href");
        await sock.sendMessage(from, {
          text: `📦 *${title}*\n🔗 [Softonic Link](${link})\n\n⚔️ Motto: Strong like Samurai, Smart like Monk.`,
        });
        return;
      }
    } catch (e) {
      console.warn("Softonic failed:", e.message);
    }

    try {
      // === 4️⃣ RapidAPI Backup ===
      const options = {
        method: "GET",
        url: "https://apk-download1.p.rapidapi.com/download",
        params: { q: query },
        headers: {
          "x-rapidapi-key": "eff3a21f6cmsh993033f4aa94a84p18bf24jsnad52292da176",
          "x-rapidapi-host": "apk-download1.p.rapidapi.com",
        },
      };

      const res = await axios.request(options);
      const data = res.data;

      if (data && data.name) {
        await sock.sendMessage(from, {
          text: `✅ *App Found via RapidAPI!*\n\n📦 *Name:* ${data.name}\n📄 *Version:* ${data.version}\n🔗 *Download:* ${data.link}\n\n⚔️ Motto: Strong like Samurai, Smart like Monk.`,
        });
        return;
      }
    } catch (e) {
      console.warn("RapidAPI backup failed:", e.message); 
    }

    // === If all fail ===
    await sock.sendMessage(from, {
      text: `❌ No APK found for "${query}". Try another app name or check spelling.`,
    });
  },
};
