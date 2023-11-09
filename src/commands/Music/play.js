const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const player = require("../../events/Musicplayer.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play music")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("what do you want to listen to?")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    if (
      query.includes("open.spotify.com") ||
      query.includes("music.apple.com") ||
      query.includes('deezer.com')
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Sorry, only YouTube links are supported`),
        ],
      });
    }

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
      // await interaction.reply({
      //   content: `Added to queue`,
      //   ephemeral: true,
      // });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Added to queue: ${query}`)
            .setColor("NotQuiteBlack"),
        ],
      });

      await player.play(voiceChannel, query, { textChannel: channel, member });
    } catch (error) {
      await interaction.reply({
        content: `An error occured`,
        ephemeral: true,
      });
      console.log(error);
    }
  },
};
