const fs = require("fs");
const path = require("path");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const msg = require("../messages/messages");

const dbPath = path.join(__dirname, "../database/gambling.json");

function loadDB() {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 4));
}

module.exports = {
    setupGamble: async (interaction, minBet, multiplier) => {
        const db = loadDB();
        if (db.active) return interaction.reply({ content: "❌ 이미 진행중인 도박이 있습니다.", ephemeral: true });

        db.active = true;
        db.minBet = minBet;
        db.multiplier = multiplier;
        db.bets = {};
        saveDB(db);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("GAMBLE_ODD").setLabel("홀").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("GAMBLE_EVEN").setLabel("짝").setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({ content: "🎰 도박 게임 시작! 버튼으로 참여하세요.", ephemeral: true });
        const gameMessage = await interaction.channel.send({
            embeds: [msg.gambleStartNotice(minBet, multiplier)],
            components: [row]
        });

        // 자동 종료 타이머 1분 30초
        setTimeout(async () => {
            if (!db.active) return;
            await module.exports.endGamble(interaction.channel, gameMessage);
        }, 90 * 1000);
    },

    handleUserBet: async (interaction) => {
        const db = loadDB();
        if (!db.active) return interaction.reply({ content: "❌ 현재 진행 중인 도박이 없습니다.", ephemeral: true });

        const choice = interaction.customId === "GAMBLE_ODD" ? "홀" : "짝";
        const userId = interaction.user.id;

        if (db.bets[userId]) return interaction.reply({ content: "❌ 이미 참여했습니다.", ephemeral: true });

        db.bets[userId] = choice;
        saveDB(db);

        return interaction.reply({ content: `✅ ${choice} 선택 완료!`, ephemeral: true });
    },

    endGamble: async (channel, gameMessage = null) => {
        const db = loadDB();
        if (!db.active) return;

        db.correct = Math.random() < 0.5 ? "홀" : "짝";

        const winners = [];
        for (const [userId, choice] of Object.entries(db.bets)) {
            if (choice === db.correct) {
                winners.push(`<@${userId}>`);
                if (!db.leaderboard[userId]) db.leaderboard[userId] = 0;
                db.leaderboard[userId] += db.minBet * db.multiplier;
            }
        }

        db.active = false;
        db.bets = {};
        saveDB(db);

        const resultText = winners.length
            ? `정답은 **${db.correct}**! 승리자: ${winners.join(", ")}`
            : `정답은 **${db.correct}**! 승리자가 없습니다.`;

        if (gameMessage) gameMessage.edit({ components: [] });
        channel.send({ embeds: [msg.gambleResultEmbed(resultText)] });
    },

    getLeaderboard: () => {
        const db = loadDB();
        const sorted = Object.entries(db.leaderboard)
            .sort((a, b) => b[1] - a[1])
            .map(([id, amount], index) => `${index + 1}. <@${id}> - ${amount} 다이아`);
        return sorted.join("\n") || "아직 참여자가 없습니다.";
    }
};
