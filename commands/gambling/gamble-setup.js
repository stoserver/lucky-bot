const { SlashCommandBuilder } = require("discord.js");
const gamble = require("../../systems/gamblingSystem");
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("도박설정")
        .setDescription("도박 게임 시작 (관리자 전용)")
        .addIntegerOption(opt => opt.setName("최소베팅").setDescription("최소 다이아").setRequired(true))
        .addNumberOption(opt => opt.setName("배율").setDescription("정답 시 배율").setRequired(true)),

    async execute(interaction) {
        if (!config.gambleAdminIds.includes(interaction.user.id))
            return interaction.reply({ content: "❌ 당신은 도박 관리자 권한이 없습니다.", ephemeral: true });

        const minBet = interaction.options.getInteger("최소베팅");
        const multiplier = interaction.options.getNumber("배율");

        await gamble.setupGamble(interaction, minBet, multiplier);
    }
};
