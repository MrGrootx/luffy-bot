const {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");
const player = require("./Musicplayer");

/**
 * @param {ChatInputCommandInteraction} interaction
 */

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const { member, guild, customId } = interaction;
    const voiceChannel = member.voice.channel;
    let isPaused = false;
    // if (!voiceChannel) {

    //   const embed = new EmbedBuilder()
    //   .setColor('Red')
    //   .setDescription(`You must be in a voice channel`)

    //   return interaction.reply({
    //     embeds: [embed]
    //   });
    // }

    if (!member.voice.channel == guild.members.me.voice.channel) {
      return interaction.reply({
        content: `Please Join <#${guild.members.me.voice.channelId}>`,
        ephemeral: true,
      });
    }

    try {
      // Pause

      if (customId === "musicsystem_pause_btn") {
      }

      // Resume

      if (customId === "musicsystem_resume_btn") {
        await player.resume(guild.id);

        interaction.reply({ content: `Resumed`, ephemeral: true });
      }

      // Skip

      // if (customId === "musicsystem_skip_btn") {
      //   const queue = player.getQueue(guild.id);
      //   if (queue) {
      //     if (voiceChannel.id !== queue.voiceChannel.id) {
      //       const embed2 = new EmbedBuilder()
      //         .setColor("DarkButNotBlack")
      //         .setDescription(
      //           "You must be in the same voice channel as the bot to play music."
      //         )
      //         .setTimestamp();
      //       return interaction.reply({ embeds: [embed2], ephemeral: true });
      //     }
      //   }

      //   try {
      //     const queue = player.getQueue(voiceChannel);

      //     if (!queue) {
      //       const embed3 = new EmbedBuilder()
      //         .setColor("DarkButNotBlack")
      //         .setDescription("No music in the playlist.")
      //         .setTimestamp();
      //       return interaction.reply({ embeds: [embed3] });
      //     }

      //     if (queue.songs.length > 1) {
      //       const skippedSong = await queue.skip(voiceChannel);

      //       if (skippedSong) {
      //         const embed4 = new EmbedBuilder()
      //           .setColor("DarkButNotBlack")
      //           .setTitle(`${skippedSong.name}`)
      //           .setTimestamp()
      //           .setFooter({ text: "skipped" });

      //         return interaction.reply({ embeds: [embed4] });
      //       }
      //     } else {
      //       const embed5 = new EmbedBuilder()
      //         .setColor("DarkButNotBlack")
      //         .setDescription("There is no music to skip.");
      //       return interaction.reply({ embeds: [embed5] });
      //     }
      //   } catch (err) {
      //     console.log(err);

      //     const embed6 = new EmbedBuilder()
      //       .setColor("Red")
      //       .setDescription("An error occurred! Try again!");

      //     return interaction.reply({ embeds: [embed6], ephemeral: true });
      //   }

        
      // }

    
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
