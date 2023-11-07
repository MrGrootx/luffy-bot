const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const player = require("../../events/Musicplayer.js");
const abbreviate = require("../../events/abbreviateMusic.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Shows the current song playing")
    .setDMPermission(false),

  async execute(interaction, client) {
    const { guild, member } = interaction;

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
      const queue = player.getQueue(guild.id);
      if (!queue || !queue.songs) {
        return interaction.reply({
          content: `There is nothing playing`,
          ephemeral: true,
        });
      }
      const song = queue.songs[0];
      const uploader = song.uploader.url
        ? `[${song.uploader.name}](${song.uploader.url})`
        : song.uploader.name;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: song.user.username,
          iconURL: song.user.displayAvatarURL(),
        })
        .setTitle(song.name)
        .setThumbnail(song.thumbnail || null)
        .setTimestamp()
        .addFields(
          {
            name: "Duration",
            value: `\`${song.formattedDuration}\``,
            inline: true,
          },
          {
            name: "views",
            value: abbreviate(song.views).toString(),
            inline: true,
          },
          { name: "uploader", value: uploader.toString(), inline: true }
        );

      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      throw error;
    }
  },

  options: {
    botPermissions: ["Connect", "Speak"],
  },
};
