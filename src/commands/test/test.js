const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
var epicgamesfree = require("free-epicgames")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("test-api")
    .setDescription("test-api"),

  async execute(interaction) {
    await interaction.reply('test');

    // const input = {
    //   method: "GET",
    //   url: "https://free-epic-games.p.rapidapi.com/free",
    //   headers: {
    //     "X-RapidAPI-Key": "884f0f23b6mshd312e2a7b54a101p1da811jsn411bf075d903",
    //     "X-RapidAPI-Host": "free-epic-games.p.rapidapi.com",
    //   },
    // };

    // try {
    //   const response = await axios.request(input);

    //   const embed = new EmbedBuilder()
    //     .setColor("NotQuiteBlack")
    //     .setDescription(`${response.data}`)

    //   await interaction.editReply({ embeds: [embed] });
    // } catch (error) {
    //     console.log(error)
    //     return
    // }
    

    console.log(await epicgamesfree.getGames('FE'))

  },
};


/*
 const options = {
      method: 'GET',
      url: 'https://free-epic-games.p.rapidapi.com/free',
      headers: {
        'X-RapidAPI-Key': '884f0f23b6mshd312e2a7b54a101p1da811jsn411bf075d903',
        'X-RapidAPI-Host': 'free-epic-games.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
*/
