const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const suggestSchema = require("../../schemas.js/SuggestionSchema-setup");
const suggestdata = require("../../schemas.js/suggestion");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("send a suggestion")
    .addStringOption((options) =>
      options
        .setName("message")
        .setDescription("Your suggestion")
        .setMinLength(5)
        .setMaxLength(300)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { options } = interaction;
    const message = options.getString("message");

    const data = await suggestSchema.findOne({ guildId: interaction.guild.id });

    const channel = interaction.guild.channels.cache.get(data.channelId);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `New Suggestion from ${interaction.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(` > ${message}`)
      .setColor("NotQuiteBlack")
      .setTimestamp()
      .setFooter({ text: `Status: Pending` });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("suggest_accept_btn")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("suggest_deny_btn")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger)
    );

    const msg = await channel.send({ embeds: [embed], components: [button] });

    await suggestdata.create({
        messageID: msg.id,
        guildId: interaction.guild.id,
        status: "Pending",
        userID: interaction.user.id,
    })
  },
};
