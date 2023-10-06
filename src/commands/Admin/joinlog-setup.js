const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const joinLogSchema = require("../../schemas.js/joinLogSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joinlog")
    .setDescription("Set up the joinLog channel")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Set the joinLog channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel you want to set joinlog")
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((command) =>
      command.setName("disable").setDescription("Disable the joinLog channel")
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    )
      return await interaction.reply({
        content: `You **do not** have the permission to do that!`,
        ephemeral: true,
      });

    const sub = await interaction.options.getSubcommand();
    const joindata = await joinLogSchema.findOne({
      GuildID: interaction.guild.id,
    });

    switch (sub) {
      case "setup":
        const getchannel = interaction.options.getChannel("channel");

        if (joindata)
          return await interaction.reply({
            content: `You have **already** set up the joinLog channel! \n> To disable Do **/joinlog disable**`,
            ephemeral: true,
          });
        else {
          const joinlogchannel =
            interaction.options.getChannel("channel") || interaction.channel;

          const setupembed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTimestamp()
            .setDescription(
              ` All join logging will happen in ${joinlogchannel}`
            );

          await interaction.reply({ embeds: [setupembed] });

          await joinLogSchema.create({
            GuildID: interaction.guild.id,
            ChannelID: joinlogchannel.id,
          });
        }

        break;
      case "disable":
        if (!joindata)
          return await interaction.reply({
            content: `You have **not** set up the joinLog setup! \n> To enable Do **/joinlog setup**`,
            ephemeral: true,
          });
        else {
          const embed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setDescription("Join Logging has been disabled");

          await interaction.reply({ embeds: [embed] });


          await joinLogSchema.deleteMany({ GuildID: interaction.guild.id });
        }
    }
  },
};
