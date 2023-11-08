const {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
    if (!voiceChannel) {
      return interaction.reply({
        content: `You must be in a voice channel to use this command`,
      });
    }

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

      if (customId === "musicsystem_skip_btn") {
        const queue = player.getQueue(guild.id);
    
        if (!queue || queue.songs.length === 0) {
            interaction.reply({ content: "There are no songs in the queue to skip.", ephemeral: true });
            return;
        }
    
        let type = "Skipped";
    
        // Skip to the next song
        await player.skip(guild.id).then(() => (type = "Skipped"));
    
        interaction.reply({ content: type, ephemeral: true });
    }
    
    

      // Stop
      if (customId === "musicsystem_stop_btn") {
        await player.stop(guild.id);

        interaction.reply({ content: `Stoped`, ephemeral: true });
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
