// events/interactionCreate.js
const feeding = require("../systems/feedingSystem");
const msg = require("../messages/messages");
const gamble = require("../systems/gamblingSystem"); // 추후 구현 예정
const verify = require("../systems/verifySystem"); // 추후 구현 예정

module.exports = {
    name: "interactionCreate",
    async execute(client, config, interaction) {

        // -----------------------------
        // 1) 버튼 처리
        // -----------------------------
        if (interaction.isButton()) {

            // ----- 밥 주기 버튼 -----
            if (interaction.customId === "FEED_ACTION") {
                return feeding.feedUser(interaction);
            }

            // ----- 도박 선택 버튼 (홀/짝) -----
            if (interaction.customId === "GAMBLE_ODD" || interaction.customId === "GAMBLE_EVEN") {
                if (!gamble.handleUserBet) return;
                return gamble.handleUserBet(interaction);
            }

            // ----- 인증 버튼 -----
            if (interaction.customId === "VERIFY_OPEN_MODAL") {
                return verify.openVerifyModal(interaction);
            }
        }

        // -----------------------------
        // 2) 모달 제출 처리
        // -----------------------------
        if (interaction.isModalSubmit()) {

            // 인증 모달
            if (interaction.customId === "VERIFY_MODAL") {
                return verify.handleVerifyModal(interaction);
            }

            // 도박 설정 모달 (관리자용)
            if (interaction.customId === "GAMBLE_SETUP_MODAL") {
                return gamble.handleSetupModal(interaction);
            }
        }

        // -----------------------------
        // 3) 슬래시 커맨드 처리
        // -----------------------------
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "❌ 오류가 발생했습니다.", ephemeral: true });
            }
        }
    }
};
