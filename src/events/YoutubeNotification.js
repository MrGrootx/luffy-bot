
const Parser = require("rss-parser");
const YoutubeSchema = require("../schemas.js/YtnotificationSchema");
const parser = new Parser();

module.exports = {
  name: "ready",

  async execute(client) {
    try {
      console.log('Script started');

      const notificationConfigs = await YoutubeSchema.find();

      async function checkYoutube() {
        for (const notificationConfig of notificationConfigs) {
          try {
            console.log(`Processing channel: ${notificationConfig.ytChannelId}`);
            
            const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${notificationConfig.ytChannelId}`;
            const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => {
              console.error(`Error fetching RSS feed for channel ${notificationConfig.ytChannelId}:`, e);
              return null;
            });

            if (!feed?.items.length) {
              continue;
            }

            const latestVideo = feed.items[0];
            const lastCheckedVid = notificationConfig.lastCheckedVid;

            if (
              !lastCheckedVid ||
              (latestVideo.id.split(":")[2] !== lastCheckedVid.id &&
                new Date(latestVideo.pubDate) > new Date(lastCheckedVid.pubDate))
            ) {
              
              const targetGuild =
                client.guilds.cache.get(notificationConfig.guildId) ||
                (await client.guilds.fetch(notificationConfig.guildId));

              if (!targetGuild) {
                await YoutubeSchema.findOneAndDelete({ _id: notificationConfig._id });
                continue;
              }

              const targetChannel =
                targetGuild.channels.cache.get(notificationConfig.noficationChannelId) ||
                (await targetGuild.channels.fetch(notificationConfig.noficationChannelId));

              if (!targetChannel) {
                await YoutubeSchema.findOneAndDelete({ _id: notificationConfig._id });
                continue;
              }

              notificationConfig.lastCheckedVid = {
                id: latestVideo.id.split(":")[2],
                pubDate: latestVideo.pubDate,
              };

              await notificationConfig.save()
                .then(() => {
                  const targetMessage =
                    notificationConfig.customMessage
                      ?.replace("{VIDEO_URL}", latestVideo.link)
                      ?.replace("{VIDEO_TITLE}", latestVideo.title)
                      ?.replace("{CHANNEL_URL}", feed.link)
                      ?.replace("{CHANNEL_NAME}", feed.title) ||
                    `New video published: ${latestVideo.title} - ${latestVideo.link}`;

                  targetChannel.send(targetMessage);
                })
                .catch((err) => null);

            } else {
            }
          } catch (error) {
            
          }
        }
        console.log('Checking Youtube Video');
      }

      await checkYoutube();


      setInterval(() => {
        checkYoutube();
      }, 60_000);

    } catch (error) {
      console.error(`Error in ${__filename}:\n`, error);
    } finally {
    }
  },
};
