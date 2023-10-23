const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

const jointocreate = require("../../schemas.js/joinToCreateSetup");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("join-to-create")
    .setDescription("Setup/Disable your join to create voice channel")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Sets up your join to create system")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "The channel you want to be your join to create voice channel "
            )
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription("The Category for the new vc to be Created in")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption((option) =>
          option
            .setName("logs")
            .setDescription("Channel creation Log send")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addIntegerOption((option) =>
          option
            .setName("voice-limit")
            .setDescription("set the limit for the new voice channels")
            .setMinValue(2)
            .setMaxValue(50)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable Join to Create System From Your Discord")
    ),

  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    )
      return interaction.reply({
        content: "**You Don't Have ManageChannel Permission**",
        ephemeral: true,
      });

    const data = await jointocreate.findOne({ Guild: interaction.guild.id });
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "setup":
        if (data)
          return await interaction.reply({
            content:
              "Join to Create System is Already Setup\n> To Disable Do ``/join-to-create disable``",
            ephemeral: true,
          });

        if (!data) {
          const channel = interaction.options.getChannel("channel");
          const category = interaction.options.getChannel("category");
          const voiceLimit = interaction.options.getInteger("voice-limit") || 2;
          const logs = interaction.options.getChannel("logs");

          await jointocreate.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Category: category.id,
            VoiceLimit: voiceLimit,
            Log: logs.id,
          });

          const embed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setDescription(`The Join To Create system has been Enabled`)
            .addFields(
              { name: "Voice Limit", value: `${voiceLimit}`, inline: true },
              { name: "Category", value: `${category}`, inline: true },
              { name: "Channel", value: `${channel}`, inline: true }
            )
            .setFooter({
              text: `${client.user.username}`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }

        break;

      case "disable":
        if (!data)
          return await interaction.reply({
            content:
              "You Do not have the join to create system setup yet\n> To Enable Do ``/join-to-create setup``",
              ephemeral: true
          });
        else {
          const embed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setDescription(`The Join To Create system has been Disabled`)

          await jointocreate.deleteMany({ Guild: interaction.guild.id });

          interaction.reply({ embeds: [embed] });
        }
    }
  },
};
