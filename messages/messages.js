// messages/messages.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    // -----------------------------
    // 1) 꿀꿀 자동 웹훅 메시지
    // -----------------------------
    pigWebhookMessage() {
        return {
            content: "꿀꿀",
        };
    },

    // -----------------------------
    // 2) 자동 식사 알림 (11,14,18,22시)
    // -----------------------------
    mealMessage(type = "meal") {
        if (type === "meal") {
            return "밥 먹을 시간이다 꿀꿀";
        } else if (type === "late") {
            return "야식이다 야르 꿀꿀";
        }
    },

    // -----------------------------
    // 3) 밥 주기 시스템 기본 임베드
    // -----------------------------
    feedingEmbed(level, currentKg, maxKg) {
        return new EmbedBuilder()
            .setTitle("명규한에게 밥을 주세요!")
            .setDescription(
                `인당 하루 **한번** 명규한에게 200kg의 밥을 줄 수 있어요.\n` +
                `밑에 **밥 주기** 버튼을 눌러 같이 명규한을 레벨업 시켜봐요!`
            )
            .setFooter({ text: `현재 레벨: ${level} | 현재: ${currentKg}/${maxKg}kg` })
            .setColor("#ff9a3c");
    },

    feedingButton() {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("FEED_ACTION")
                .setLabel("밥 주기")
                .setStyle(ButtonStyle.Primary)
        );
    },

    dailyFeedResetMsg() {
        return "📥 **모든 사용자 밥 주기 참여 기록이 초기화되었습니다!**";
    },

    levelUpMsg(level) {
        return `🎉 **명규한이 ${level}레벨을 달성했습니다!**`;
    },

    specialLevelMsg(level) {
        return new EmbedBuilder()
            .setTitle(`${level}레벨을 달성했어요!`)
            .setDescription("마인크래프트에서 삼겹살 파티를 즐겨보세요!")
            .setFooter({ text: "가장 많이 지급한 사용자:" })
            .setColor("#ff5e5e");
    },

    // -----------------------------
    // 4) 도박 게임 메시지
    // -----------------------------
    gambleStartNotice(minBet, multiplier) {
        return new EmbedBuilder()
            .setTitle("🎰 홀/짝 도박 게임 시작!")
            .setDescription(
                `최소 베팅: **${minBet} 다이아**\n` +
                `정답 맞추면 **x${multiplier}** 배 지급!\n\n` +
                `슬래시 커맨드로 참여해주세요!`
            )
            .setColor("#2ecc71");
    },

    gambleSelectPanel() {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("GAMBLE_ODD")
                .setLabel("홀")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("GAMBLE_EVEN")
                .setLabel("짝")
                .setStyle(ButtonStyle.Primary)
        );
    },

    gambleResultEmbed(winnerList) {
        return new EmbedBuilder()
            .setTitle("🎰 도박 결과 발표!")
            .setDescription(winnerList)
            .setColor("#9b59b6");
    },

    // -----------------------------
    // 5) 인증 시스템 메시지
    // -----------------------------
    verifyEmbed() {
        return new EmbedBuilder()
            .setTitle("학생 인증하기")
            .setDescription("아래 버튼을 눌러 학번/이름을 입력하고 인증을 완료하세요.")
            .setColor("#3498db");
    },

    verifyButton() {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("VERIFY_OPEN_MODAL")
                .setLabel("인증하기")
                .setStyle(ButtonStyle.Success)
        );
    },

    verifySuccess(name) {
        return `✅ **${name}님, 인증이 완료되었습니다!**`;
    },

    verifyFail() {
        return `❌ 등록된 학생 정보와 일치하지 않습니다.`;
    },

    // -----------------------------
    // 6) 분쟁 타임아웃 경고 / 처리 메시지
    // -----------------------------
    conflictWarnMsg() {
        return "⚠️ **분쟁이 감지되었습니다. 2분 안에 멈추지 않으면 타임아웃됩니다.**";
    },

    conflictTimeoutEmbed(userList) {
        return new EmbedBuilder()
            .setTitle("⛔ 타임아웃 적용됨")
            .setDescription(
                `아래 사용자들은 4분간 분쟁을 지속하여 **2시간 타임아웃** 처리되었습니다.\n\n${userList.join(
                    "\n"
                )}`
            )
            .setFooter({ text: "마음을 진정시키고 다시 이야기해요." })
            .setColor("#e74c3c");
    },
};
