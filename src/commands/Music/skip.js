const { SlashCommandBuilder } = require("discord.js");

const player = require("../../events/Musicplayer.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skip the music")
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
      let type = "Skipped";

      await player.skip(guild.id).then(() => (type = "Skipped"));
      // .catch(() =>  type = "stopped");

      return interaction.reply({
        content: type,
        ephemeral: true,
      });
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
