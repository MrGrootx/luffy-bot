const { SlashCommandBuilder } = require("discord.js");
const tinyurl = require("tinyurl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("link-shorten")
    .setDescription("Shortens a Url")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The Url to Shorten")
        .setRequired(true)
    ),

    async execute (interaction) {
        const url = interaction.options.getString("url");

        tinyurl.shorten(url, function (res, err) {
            if(err) return interaction.reply({ content: `Error: ${err}`, ephemeral: true});
            interaction.reply({ content: `Your Url is: ${res}`, ephemeral: true});
        })
        
    }
};
