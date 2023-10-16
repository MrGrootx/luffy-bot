const { ButtonBuilder } = require("@discordjs/builders");
const {SlashCommandBuilder, EmbedBuilder, Embed, ActionRowBuilder, ButtonStyle } = require("discord.js");
const ms = require('ms')
const one = require('../../../emoji.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("luffy-test")
    .setDescription("luffy-test"),

    async execute (interaction, client) {
        interaction.setCooldown(10000) //  cooldown
        await interaction.reply({ content: `test ${one.pingpong} `, ephemeral: true})

    } 
}