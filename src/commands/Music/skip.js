const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const player = require("../../events/Musicplayer.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skip the music")
    .setDMPermission(false),

  // async execute(interaction, client) {
  //   const { member, guild } = interaction;

  //   // const query = options.getString("query");
  //   const voiceChannel = member.voice.channel;

  //   if (!voiceChannel) {
  //     return interaction.reply({
  //       content: `You must be in a voice channel to use this command`,
  //     });
  //   }

  //   if (!member.voice.channel == guild.members.me.voice.channel) {
  //     return interaction.reply({
  //       content: `Please Join <#${guild.members.me.voice.channelId}>`,
  //       ephemeral: true,
  //     });
  //   }

  //   try {
  //     let type = "Skipped";

  //     await player.skip(guild.id).then(() => (type = "Skipped"));
  //     // .catch(() =>  type = "stopped");

  //     return interaction.reply({
  //       content: type,
  //       ephemeral: true,
  //     });
  //   } catch (error) {
  //     await interaction.reply({
  //       content: `An error occured`,
  //       ephemeral: true,
  //     });
  //     console.log(error);
  //   }
  // },

  async execute(interaction) {
    const { member, guild, channel } = interaction;

    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      const embed1 = new EmbedBuilder()
        .setColor('DarkButNotBlack')
        .setDescription(
          "You must be in a voice channel to execute music commands."
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed1], ephemeral: true });
    }

    const queue = player.getQueue(guild.id);
    if (queue) {
      if (voiceChannel.id !== queue.voiceChannel.id) {
        const embed2 = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setDescription(
            "You must be in the same voice channel as the bot to play music."
          )
          .setTimestamp();
        return interaction.reply({ embeds: [embed2], ephemeral: true });
      }
    }

    try {
      const queue =  player.getQueue(voiceChannel);

      if (!queue) {
        const embed3 = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setDescription("No music in the playlist.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed3] });
      }

      if (queue.songs.length > 1) {
        const skippedSong = await queue.skip(voiceChannel);

        if (skippedSong) {
          const embed4 = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setTitle(`${skippedSong.name}`)
            // .addFields(
            //   {
            //     name: "Duration",
            //     value: `${skippedSong.formattedDuration}`,
            //     inline: true,
            //   },
            //   { name: "Link", value: `${skippedSong.url}`, inline: true },
            //   {
            //     name: "Uploader",
            //     value: `${skippedSong.uploader.name}`,
            //     inline: true,
            //   },
            //   { name: "Views", value: `${skippedSong.views}`, inline: true },
            //   {
            //     name: "Live",
            //     value: `${skippedSong.isLive ? "Yes" : "No"}`,
            //     inline: true,
            //   }
            // )
            // .setThumbnail(skippedSong.thumbnail)
            .setTimestamp()
            .setFooter({ text: "skipped" });
            
          return interaction.reply({ embeds: [embed4] });
        }
      } else {
        const embed5 = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setDescription("There is no music to skip.")
        return interaction.reply({ embeds: [embed5] });
      }
    } catch (err) {
      console.log(err);

      const embed6 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("An error occurred! Try again!")

      return interaction.reply({ embeds: [embed6], ephemeral: true });
    }
  },
};
