const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Get a random quote"),

  async execute(interaction) {
    await interaction.deferReply();

    const input = {
      method: "GET",
      url: "https://quotes15.p.rapidapi.com/quotes/random/",
      headers: {
        "X-RapidAPI-Key": "884f0f23b6mshd312e2a7b54a101p1da811jsn411bf075d903",
        "X-RapidAPI-Host": "quotes15.p.rapidapi.com",
      },
    };

    try {
      const output = await axios.request(input);

      const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setDescription(`${output.data.content}`)
        .setFooter({ text: `Author: ${output.data.originator.name}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.log(error)
        return
    }
  },
};
