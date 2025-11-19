const { SlashCommandBuilder } = require("discord.js");
const gamble = require("../../systems/gamblingSystem");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("도박리더보드")
        .setDescription("누적 획득 다이아 확인"),

    async execute(interaction) {
        const text = gamble.getLeaderboard();
        await interaction.reply({ content: text });
    }
};
