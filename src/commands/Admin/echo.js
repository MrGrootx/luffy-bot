const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Send message to the specified channel.")
    .addStringOption((option) =>
      option.setName("message").setDescription("message").setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to send message")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    )
      return await interaction.reply({
        content: "You **do not** have the permission to do that!",
        ephemeral: true,
      });

    let message = interaction.options.getString("message");
    const channel =
      interaction.options.getChannel("channel") || interaction.channel

    await channel.send(message);

    await interaction.reply({
      content: `Successfully sent ${message} to ${channel}`,
      ephemeral: true,
    });
  },
};
