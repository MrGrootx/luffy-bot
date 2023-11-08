const { SlashCommandBuilder } = require("discord.js");

const player = require("../../events/Musicplayer.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("resume the song")
    .setDMPermission(false),
  async execute(interaction, client) {
    const { member, guild } = interaction;

    // const query = options.getString("query");
    const voiceChannel = member.voice.channel;

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
      await interaction.reply({
        content: `Resumed`,
        ephemeral: true,
      });
      await player.resume(guild.id);
    } catch (error) {
      await interaction.reply({
        content: `An error occured`,
        ephemeral: true,
      });
      console.log(error);
    }
  },
};
