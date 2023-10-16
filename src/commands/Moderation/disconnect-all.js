const {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect-all")
    .setDescription("disconnect all members from specified voice channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "which voice channel"
        )
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    )
      return interaction.reply({
        content: "You Don't have **BanMembers** permission",
        ephemeral: true,
      });

    const channel = interaction.options.getChannel("channel");

    // Retrieves all members in the voice channel
    const members = channel.members.filter((member) => member.voice.channel);

    // Disconnects each member from the voice channel
    members.forEach((member) => {
      member.voice.disconnect();
    });

    return interaction.reply({
      content: "Disconnected All Members",
      ephemeral: true,
    });
  },
};
