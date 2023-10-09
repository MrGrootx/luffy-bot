const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("kiss a discord member")
    .addUserOption(option => option
        .setName("user")
        .setDescription("the user you want to kiss")
        .setRequired(true)
    ),

    async execute (interaction) {
        const result = await axios.get('https://api.otakugifs.xyz/gif?reaction=kiss&format=gif');

        const user = interaction.options.getUser("user");


        if (interaction.user.id === user.id) {

            return interaction.reply({ content: '**You can\'t kiss yourself**', ephemeral: true })
        };

        const embed = new EmbedBuilder()
        .setImage(result.data.url)
        .setColor("NotQuiteBlack")


        return await interaction.reply({ content: ` 😘 <@${user.id}> **you've got a kiss from** ${interaction.user.username} \n\n`, embeds: [embed]})
    }
}