const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap a discord member")
    .addUserOption(option => option
        .setName("user")
        .setDescription("you want to slap")
        .setRequired(true)
    ),

    async execute (interaction) {
        const result = await axios.get('https://api.otakugifs.xyz/gif?reaction=slap&format=gif')

        const x = interaction.options.getUser("user");

        if (interaction.user.id === x.id) {
            return interaction.reply({ content: `**you cant slap yourself**`, ephemeral: true })

        };

        const embed = new EmbedBuilder()
        .setImage(result.data.url)
        .setColor("NotQuiteBlack")

        return await interaction.reply({ content: ` 👊 ${x} you've got a slap from  ${interaction.user.username} \n\n`, embeds: [embed]})
    }
}