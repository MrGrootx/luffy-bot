const { ButtonBuilder } = require("@discordjs/builders");
const {SlashCommandBuilder, EmbedBuilder, Embed, ActionRowBuilder, ButtonStyle } = require("discord.js");

const one = require('../../../emoji.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("luffy-test")
    .setDescription("luffy-test"),

    async execute (interaction, client) {

        await interaction.reply({ content: `test ${one.pingpong} `, ephemeral: true})

    } 
}