const { 
    SlashCommandBuilder, 
    EmbedBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder
 } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bug-report")
    .setDescription("Report a bug to the developers"),

    async execute (interaction) {

        const modalreport = new ModalBuilder()
        .setTitle('Bug & Command Abuse Reporting')
        .setCustomId('bugreportdev')

        const commandtest = new TextInputBuilder()
        .setCustomId('command')
        .setRequired(true)
        .setPlaceholder('Please only state the command name')
        .setLabel('What command has a bug? or has been abused')
        .setStyle(TextInputStyle.Short)

        const reportdescription = new TextInputBuilder()
        .setCustomId('description')
        .setRequired(true)
        .setPlaceholder(`Be sure to be as detailed as possible so the developers can take action`)
        .setLabel('Describe the bug or abuse')
        .setStyle(TextInputStyle.Paragraph)

        const one = new ActionRowBuilder().addComponents(commandtest)
        const twodeep  = new ActionRowBuilder().addComponents(reportdescription)

        modalreport.addComponents(one, twodeep)

        await interaction.showModal(modalreport)


    }
};
