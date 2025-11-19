const { SlashCommandBuilder } = require("discord.js");
const gamble = require("../../systems/gamblingSystem");
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("도박종료")
        .setDescription("도박 게임 종료 (관리자 전용)"),

    async execute(interaction) {
        if (!config.gambleAdminIds.includes(interaction.user.id))
            return interaction.reply({ content: "❌ 당신은 도박 관리자 권한이 없습니다.", ephemeral: true });

        await gamble.endGamble(interaction.channel);
        await interaction.reply({ content: "✅ 도박 종료 및 결과 집계 완료", ephemeral: true });
    }
};
