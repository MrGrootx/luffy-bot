const { SlashCommandBuilder,  } = require('discord.js');
const wait = require('util').promisify(setTimeout);
module.exports = {
    premiumOnly: false,
    cooldown: 5000,
    data: new SlashCommandBuilder()
    .setName('devping')
    .setDescription('devping'),
   
    async execute (interaction) {

        await interaction.reply('pong')

        interaction.setCooldown(10000) //  cooldown

    }
}