const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const reportSchema = require("../../schemas.js/reportSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-system-setup")
    .setDescription("Setup the report system")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send reports")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    )
      return interaction.reply({
        content: "You do not have permission to use this command",
        ephemeral: true,
      });

      const { channel, guildId, options }  = interaction;
      const reportchannel = options.getChannel("channel");

      const embed = new EmbedBuilder()

      reportSchema.findOne({ Guild: guildId }, async (err, data) => {
        if(!data) {
            await reportSchema.create({
                Guild: guildId,
                Channel: reportchannel.id
            })

            embed.setColor('NotQuiteBlack')
            .setDescription(`Report system has been setup`)
            .addFields(
                { name: 'Channel', value: `${reportchannel}` , inline: true}
            ) 
        } else if(data) {
            const channel = client.channels.cache.get(data.Channel)

          return interaction.reply({ content: `**Report system is already setup in** ${channel}\nTo Disable: **/report-disable**`, ephemeral: true});
            
        }

        // return await interaction.reply({ embeds: [embed] })
      })

  },
};
