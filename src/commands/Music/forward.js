const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const player = require("../../events/Musicplayer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forward")
        .setDescription("Forward seconds in a music")
        .addIntegerOption(option =>
            option.setName("seconds")
                .setDescription("Number of seconds (10 = 10 seconds)")
                .setMinValue(0)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const seconds = options.getInteger("seconds");
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            const embed1 = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setDescription("You must be in a voice channel to execute music commands.")
            return interaction.reply({ embeds: [embed1], ephemeral: true });
        }

        const queue = player.getQueue(guild.id);
    if (queue) {
      if (voiceChannel.id !== queue.voiceChannel.id) {
        const embed2 = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setDescription("You must be in the same voice channel as the bot to play music.")
        return interaction.reply({ embeds: [embed2], ephemeral: true });
      }
    }

        try {

            const queue = player.getQueue(voiceChannel);

            if (!queue) {
                const embed3 = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setDescription("No music in the playlist.")
                return interaction.reply({ embeds: [embed3] });
            }

            await queue.seek(queue.currentTime + seconds);
            const embed4 = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setDescription(`You forward the music by ${seconds} seconds.`)
            return interaction.reply({ embeds: [embed4] });

        } catch (err) {
            console.log(err);

            const embed5 = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setDescription("An error occurred! Try again!")

            return interaction.reply({ embeds: [embed5], ephemeral: true });
        }
    }
}