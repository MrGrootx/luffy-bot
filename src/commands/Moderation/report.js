const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
  } = require("discord.js");
  const reportSchema = require("../../schemas.js/reportSchema");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("report")
      .setDescription("report an issue"),
  
    async execute(interaction, client) {
        
        reportSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {
            if(!data) {
                return interaction.reply({ content: "Report system is not setup yet", ephemeral: true })
            }

            if(data) {
                const model = new ModalBuilder()
                .setTitle('Report Form')
                .setCustomId('modal')

                const  contact = new TextInputBuilder()
                .setCustomId('contact')
                .setLabel('provide us with a form of contect')
                .setPlaceholder('Contact')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

                const  issue = new TextInputBuilder()
                .setCustomId('issue')
                .setLabel('What would you like to report?')
                .setPlaceholder('A member, server issue, or something else?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

                const  description = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Describe the issue')
                .setPlaceholder('Be as detailed as possible')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(contact);
                const secondActionRow = new ActionRowBuilder().addComponents(issue);
                const thirdActionRow = new ActionRowBuilder().addComponents(description);

                model.addComponents(firstActionRow, secondActionRow, thirdActionRow);

              await  interaction.showModal(model);
            }
        })
    
    }
  };
  