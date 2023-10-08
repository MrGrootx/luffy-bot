const { SlashCommandBuilder,  } = require('discord.js');
const wait = require('util').promisify(setTimeout);
module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
    .setName('devping')
    .setDescription('devping'),
   
    async execute (interaction) {

        await interaction.reply('pong')

    }
}