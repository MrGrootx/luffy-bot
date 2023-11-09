const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const Discord = require("discord.js"); // Import the Discord module

const client = require("../index"); // Create a new Discord client

//     plugins: [
//         new SpotifyPlugin({
//           parallel: true,
//           emitEventsAfterFetching: false,
//           api: {
//             clientId: "ab1a30961c774fc3bb45ef41d87926ea",
//             clientSecret: "d070a153e4c240e7aed1156193395a1f",
//             topTracksCountry: "VN",
//           },
//         }),
//         new SoundCloudPlugin(),
//         // new YtDlpPlugin()
//       ],
// });

const player = new DisTube(client, {
  emitAddSongWhenCreatingQueue: false,
  emitNewSongOnly: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: true,
  searchSongs: 0,
  searchCooldown: 30,

  plugins: [
    // new SpotifyPlugin({
    //   parallel: false,
    //   emitEventsAfterFetching: true,
    // }),
    // new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

let muschannel;
let originalMessage;
player.on("playSong", (queue, song) => {
  const uploader = song.uploader.url
    ? `[${song.uploader.name}](${song.uploader.url})`
    : song.uploader.name;

  const buttons = new ActionRowBuilder().addComponents(
    // new ButtonBuilder()
    // .setCustomId('musicsystem_pause_btn')
    // .setLabel('Pause')
    // .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("musicsystem_stop_btn")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger),

    // new ButtonBuilder()
    // .setCustomId('musicsystem_resume_btn')
    // .setLabel('Resume')
    // .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("musicsystem_skip_btn")
      .setLabel("Skip")
      .setStyle(ButtonStyle.Secondary)
  );

  muschannel = queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle(song.name)
        .setURL(song.url)
        .setTimestamp()
        .setFooter({ text: `Now Playing` })
        .setColor("NotQuiteBlack")
        .setThumbnail(song.thumbnail || null)
        .setAuthor({
          name: song.user.username,
          iconURL: song.user.displayAvatarURL(),
        })
        .addFields(
          {
            name: "Duration",
            value: song.formattedDuration.toString(),
            inline: true,
          },
          {
            name: "Channel",
            value: queue.voiceChannel.toString(),
            inline: true,
          },
          {
            name: "Uploader",
            value: uploader,
            inline: true,
          },
          {
            name: "Reqested By",
            value: song.user.toString(),
            inline: true,
          }
        ),
    ],
    components: [buttons],
  }).then((message) => {
    // Store the message object in the variable
    originalMessage = message;
  });
});

player.on("addSong", (queue, song) => {
  queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail || null)
        .setAuthor({
          name: song.user.username,
          iconURL: song.user.displayAvatarURL(),
        })
        .setColor("NotQuiteBlack")
        .setFooter({ text: "Added to queue" })
        .setTimestamp(),
    ],
  });
});


player.on("finish", (queue) => {
    if (originalMessage) {
      
    
      // Edit the original message to include the updated button with the embed
      originalMessage.edit({
        embeds: [
          new EmbedBuilder()
            .setDescription("Song Ended!")
            .setColor('DarkButNotBlack'),
        ],
        components: [], // Add the action row with the disabled button
      });
    }
  });

player.on("error", (channel, error) => {
  if (channel) channel.send("An error occured");
  else console.log(error);
});

module.exports = player;

/**
 * npm i @discordjs/opus distube libsodium-wrappers yt-search ytdl-core ffmpeg-static
 */
