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
      .setName("youtube-notification-setup")
      .setDescription("Setup YouTube notification for a channel")
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
          .setDescription("The Channel you want to send notification")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
      )
      .addStringOption((option) =>
        option
          .setName("custom-message")
          .setDescription(
            "Templates: {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}"
          )
      ),
  
    async execute(interaction) {
      try {
        await interaction.deferReply({ ephemeral: true });
  
        const targetYtChannelId = interaction.options.getString("youtube-id");
        const targetChannel = interaction.options.getChannel("target-channel");
        const customMessage = interaction.options.getString("custom-message");
  
        const duplicateExists = await YoutubeSchema.exists({
          noficationChannelId: targetChannel.id,
          ytChannelId: targetYtChannelId,
        });
  
        if (duplicateExists) {
          interaction.followUp(
            `That YouTube Channel has already been configured for that text channel.`
          );
          return;
        }
  
        const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${targetYtChannelId}`;
  
        const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => {
          interaction.followUp({
            content:
              "There was an error fetching the channel. Ensure the ID is correct",
          });
          return; // Return null here to indicate an error condition
        });
  
        if (!feed) return;
  
        const ChannelName = feed.title;
  
        const noticationConfig = new YoutubeSchema({
          guildId: interaction.guildId,
          noficationChannelId: targetChannel.id,
          ytChannelId: targetYtChannelId,
          customMessage: customMessage,
          lastChecked: new Date(),
          lastCheckedVid: null,
        });
  
        if (feed.items.length) {
          const latestVideo = feed.items[0];
          noticationConfig.lastCheckedVid = {
            id: latestVideo.id.split(":")[2],
            pubDate: latestVideo.pubDate,
          };
        }
  
        noticationConfig
          .save()
          .then(() => {
            const embed = new EmbedBuilder()
              .setTitle("YouTube Notification Setup")
              .setDescription(
                `Channel: ${ChannelName} has been set up for <#${targetChannel.id}>`
              )
              .setTimestamp();
  
            interaction.followUp({ embeds: [embed] });
          })
          .catch((err) => {
            console.error(err);
            interaction.followUp({
              content: "There was an error saving the configuration",
            });
          });
      } catch (error) {
        console.error(`ERROR in ${error}`);
      }
    },
  };
  