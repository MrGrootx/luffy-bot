const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const reportSchema = require("../../schemas.js/reportSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-disable")
    .setDescription("report-disable your report system"),

  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return interaction.reply({
        content: "You do not have permission to use this command",
        ephemeral: true,
      });

    const { channel, guildId, options } = interaction;
    const reportchannel = options.getChannel("channel");

    reportSchema.deleteMany({ Guild: guildId }, async (err, data) => {
      return interaction.reply({
        content: `Report system has been disabled`,
        ephemeral: true,
      }).catch((err) => {
        return
      })
    });
  },
};
