const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const player = require("../../events/Musicplayer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the current playlist"),
  async execute(interaction) {
    const { member, guild } = interaction;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      const embed1 = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Red")
        .setDescription(
          "You must be in a voice channel to execute music commands."
        )
        
      return interaction.reply({ embeds: [embed1], ephemeral: true });
    }

    const queue = player.getQueue(guild.id);
    if (queue) {
      if (voiceChannel.id !== queue.voiceChannel.id) {
        const embed2 = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setDescription(
            "You must be in the same voice channel as the bot to play music."
          );
        return interaction.reply({ embeds: [embed2], ephemeral: true });
      }
    }

    try {
      const queue = player.getQueue(voiceChannel);

      if (!queue) {
        const embed3 = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setDescription("No music in the playlist.");
        return interaction.reply({ embeds: [embed3] });
      }

      await queue.shuffle();
      const embed4 = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setDescription(`The music in the playlist is shuffled.`);
      return interaction.reply({ embeds: [embed4] });
    } catch (err) {
      console.log(err);

      const embed5 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("An error occurred! Try again!");

      return interaction.reply({ embeds: [embed5], ephemeral: true });
    }
  },
};
