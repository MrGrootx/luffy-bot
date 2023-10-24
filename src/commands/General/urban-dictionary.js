const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('urban-dictionary')
    .setDescription('Look up words using Urban Dictionary.')
    .addStringOption(option => option.setName('word').setDescription('Input a word.').setRequired(true)),
    async execute (interaction) {

        await interaction.deferReply();

       const { options } = interaction;
       const word = options.getString('word');
       const { data: { list }} = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);

       try {
        
        const [answer] = list;

        const embed = new EmbedBuilder()
        .setAuthor({ name: 'Urban Dictionary', iconURL: interaction.user.displayAvatarURL()})
        .setColor('NotQuiteBlack')
        .setURL(answer.permalink)
        .setTitle(`Word Looked Up: ${answer.word}`)
        .addFields({ name: `**DEFINITION**`, value: trim(answer.definition) })
        .addFields({ name: `**EXAMPLE**`, value: trim(answer.example) })
        .addFields({ name: `**RATINGS**`, value: `${answer.thumbs_up} 👍 || ${answer.thumbs_down} 👎`})
        .setFooter({ text: `Author: ${answer.author} || Written on: ${answer.written_on}`})
        .setTimestamp()

        await interaction.editReply({ embeds: [embed] });

       } catch (err) {
        await interaction.editReply({ content: `An **error** occured! Please try again.`});
       }

       function trim(input) {
        return input.length > 1024 ? `${input.slice(0, 1020)} ...`: input;
       }
    } 
}