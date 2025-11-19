// systems/feedingSystem.js
const fs = require("fs");
const path = require("path");
const msg = require("../messages/messages");
const feedingDB = path.join(__dirname, "../database/feeding.json");

function loadDB() {
    return JSON.parse(fs.readFileSync(feedingDB, "utf8"));
}

function saveDB(data) {
    fs.writeFileSync(feedingDB, JSON.stringify(data, null, 4));
}

module.exports = {
    // --------------------------
    // 밥 주기 초기 임베드 생성
    // --------------------------
    sendFeedingMessage: async (channel) => {
        const db = loadDB();
        await channel.send({
            embeds: [msg.feedingEmbed(db.level, db.currentKg, db.maxKg)],
            components: [msg.feedingButton()]
        });
    },

    // --------------------------
    // 밥 주기 진행
    // --------------------------
    feedUser: async (interaction) => {
        const userId = interaction.user.id;
        const db = loadDB();

        // 오늘 이미 줬는지 체크
        if (db.feedsToday[userId]) {
            return interaction.reply({
                content: "❌ 오늘은 이미 명규한에게 밥을 주었습니다!",
                ephemeral: true
            });
        }

        // 밥 주기 처리
        db.feedsToday[userId] = true;

        db.currentKg += 200;

        if (!db.totalGiven[userId]) db.totalGiven[userId] = 0;
        db.totalGiven[userId] += 200;

        // 레벨업 체크
        let levelUp = false;
        let special = false;

        if (db.currentKg >= db.maxKg) {
            db.level++;
            db.currentKg = 0;

            // 레벨 올라갈수록 난이도 증가 (너가 요청한 19레벨 이후 매우 어렵게)
            if (db.level >= 19) {
                db.maxKg += 400; 
            } else {
                db.maxKg += 200;
            }

            levelUp = true;

            // 특별 레벨 도달 시
            if (db.announceLevels.includes(db.level)) {
                special = true;
            }
        }

        saveDB(db);

        // 메시지 업데이트
        await interaction.update({
            embeds: [msg.feedingEmbed(db.level, db.currentKg, db.maxKg)],
            components: [msg.feedingButton()]
        });

        // 레벨업 메시지 (일반)
        if (levelUp) {
            interaction.channel.send(msg.levelUpMsg(db.level));
        }

        // 특별 레벨
        if (special) {
            const topUser = Object.entries(db.totalGiven)
                .sort((a, b) => b[1] - a[1])[0];

            const topName = `<@${topUser[0]}> (${topUser[1]}kg)`;

            const embed = msg.specialLevelMsg(db.level);
            embed.setFooter({ text: `가장 많이 준 사용자: ${topName}` });

            interaction.guild.channels.cache
                .get("공지채널ID여기에") // ← 변경해야 함
                .send({ embeds: [embed] });
        }
    },

    // --------------------------
    // 매일 자정 리셋
    // --------------------------
    resetDaily: () => {
        const db = loadDB();
        db.feedsToday = {};
        saveDB(db);
    }
};
