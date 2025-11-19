// commands/feeding/setup-feeding.js
const { SlashCommandBuilder } = require("discord.js");
const feeding = require("../../systems/feedingSystem");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("밥주기세팅")
        .setDescription("밥 주기 초기 임베드를 생성합니다."),

    async execute(interaction) {
        await interaction.reply({ content: "밥주기 메시지를 생성합니다!", ephemeral: true });
        await feeding.sendFeedingMessage(interaction.channel);
    }
};
