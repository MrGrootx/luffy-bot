const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const YoutubeSchema = require("../../schemas.js/YtnotificationSchema");
const Parser = require("rss-parser");
const parser = new Parser();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube-notification-remove")
    .setDescription("remove YouTube notification for a channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("youtube-id")
        .setDescription("YouTube Channel ID")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("target-channel")
        .setDescription("The Channel you want to remove notification")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const targetYtChannelId = interaction.options.getString("youtube-id");
      const targetNotificationChannel =
        interaction.options.getChannel("target-channel");

      const targetChannel = await YoutubeSchema.findOne({
        ytChannelId: targetYtChannelId,
        noficationChannelId: targetNotificationChannel.id,
      });

      if (!targetChannel) {
        interaction.followUp(
          "That Youtube channel has not been configured for notification.."
        );
        return;
      }

      await YoutubeSchema.deleteOne({
        _id: targetChannel._id,
      })
        .then(() => {
          interaction.followUp(
            "Notification for that channel has been Removed"
          );
        })
        .catch((err) => {
          interaction.followUp(
            "There was a database error. Please try again later"
          );
        });
    } catch (error) {
      console.log(`Error in ${__filename}`, error);
    }
  },
};
