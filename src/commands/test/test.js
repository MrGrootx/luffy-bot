const { ButtonBuilder } = require("@discordjs/builders");
const {SlashCommandBuilder,
     EmbedBuilder, Embed, ActionRowBuilder, ButtonStyle,
    StringSelectMenuBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, PermissionsBitField, } = require("discord.js");
const ms = require('ms')
const one = require('../../../emoji.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("luffy-test")
    .setDescription("luffy-test"),

    async execute (interaction, client) {
        // interaction.setCooldown(10000) //  cooldown
        // await interaction.reply({ content: `test ${one.pingpong} `, ephemeral: true})

        const modal = new ModalBuilder()
        .setCustomId('test_test')
        .setTitle('test')

        const name = new TextInputBuilder()
        .setCustomId('nametesfesfefeftest')
        .setLabel('name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

        const firstrow = new ActionRowBuilder().addComponents(name) 

        modal.addComponents(firstrow)
        await interaction.showModal(modal)


    } 
}