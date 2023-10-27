const {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");

const suggestSchema = require("../../schemas.js/SuggestionSchema-setup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest-config")
    .setDescription("Setup/disable the suggest system.")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Setup the suggest system.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel you need to send Suggestions")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((command) =>
      command.setName("disable").setDescription("disable Suggestions System")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const { options } = interaction;

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "setup":
        const channel = options.getChannel("channel");

        const data = await suggestSchema.findOne({
          guildId: interaction.guild.id,
        });

        if (data) {
          if (data)
            return interaction.reply({
              content:
                "**The Suggestion System is already setup**\n> To Disable To ``/suggest-disable``",
              ephemeral: true,
            });
        }

        if (!data) {
          await suggestSchema.create({
            guildId: interaction.guild.id,
            channelId: channel.id,
          });

          const embed = new EmbedBuilder();

          interaction.reply({
            embeds: [
              embed
                .setDescription(
                  `Successfully setup Suggestion System in <#${channel.id}>`
                )
                .setColor("NotQuiteBlack"),
            ],
          });
        }

        break;
      case "disable":
        const data1 = await suggestSchema.findOne({
          guildId: interaction.guild.id,
        });

        if (!data1)
          return interaction.reply({
            content: "**The Suggestion System is already disabled**\n> To Enable ``/suggest-setup``",
            ephemeral: true,
          });

        if (data1) {
          interaction.reply({
            content: "**Successfully disabled Suggestion System**",
          });

          await suggestSchema.deleteOne({ guildId: interaction.guild.id });
        }

        break;
    }
  },
};
