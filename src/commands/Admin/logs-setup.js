const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const logSchema = require("../../schemas.js/logSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("setup your  logging system.")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Sets up your logging system.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specified channel will receive logs.")
            .setRequired(false)
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement
            )
        )
    )
    .addSubcommand((command) =>
      command.setName("disable").setDescription("Disables your logging system.")
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    )
      return await interaction.reply({
        content: "You **do not** have the permission to do that!",
        ephemeral: true,
      });

    const sub = await interaction.options.getSubcommand();
    const data = await logSchema.findOne({ Guild: interaction.guild.id });

    switch (sub) {
      case "setup":
        if (data)
          return await interaction.reply({
            content: `You have **already** set up the logging system! \n> To disable Do **/logs disable**`,
            ephemeral: true,
          });
        else {
          const logchannel =
            interaction.options.getChannel("channel") || interaction.channel;

          const setupembed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTimestamp()
            .addFields({
              name: `Logging was Enabled`,
              value: `Your logging system has been set up successfuly...`,
            })
            .addFields({ name: `Channel`, value: `${logchannel}` });

          await interaction.reply({ embeds: [setupembed] });

          await logSchema.create({
            Guild: interaction.guild.id,
            Channel: logchannel.id,
          });
        }

        break;
      case "disable":
        if (!data)
          return await interaction.reply({
            content: `You have **not** set up the logging system! \n> To enable Do **/logs setup**.`,
            ephemeral: true,
          });
        else {
          const disableembed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTimestamp()
            .addFields({
              name: `Logging was Disabled`,
              value: `Your logging system has been disabled successfuly...`,
            });

          await interaction.reply({ embeds: [disableembed] });

          await logSchema.deleteMany({ Guild: interaction.guild.id });
        }
    }
  },
};
