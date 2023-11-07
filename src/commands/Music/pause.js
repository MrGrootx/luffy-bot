const { SlashCommandBuilder } = require("discord.js");

const player = require("../../events/Musicplayer.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("pause the current queue")
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
        content: `Paused`,
        ephemeral: true,
      });
      await player.pause(guild.id);
    } catch (error) {
      await interaction.reply({
        content: `An error occured`,
        ephemeral: true,
      });
      console.log(error);
    }
  },
  options: {
    botPermissions: ["Connect", "Speak", "SendMessages"],
  },
};
