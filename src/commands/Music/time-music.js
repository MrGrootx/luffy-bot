const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const player = require("../../events/Musicplayer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("time-music")
        .setDescription("Shows how long the music has been playing"),
    async execute(interaction) {
        const { member, guild } = interaction;

        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            const embed1 = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setDescription("You must be in a voice channel to execute music commands.")
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();
            return interaction.reply({ embeds: [embed1], ephemeral: true });
        }

        const queue = player.getQueue(guild.id);
        if (queue) {
            if (voiceChannel.id !== queue.voiceChannel.id) {
                const embed2 = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription("You must be in the same voice channel as the bot to play music.")
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
                return interaction.reply({ embeds: [embed2], ephemeral: true });
            }
        }

        try {
            const queue = player.getQueue(voiceChannel);

            if (!queue) {
                const embed3 = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription("No music in the playlist.")
                return interaction.reply({ embeds: [embed3] });
            }

            const timeInSeconds = queue.currentTime;
            const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');

            const embed4 = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .addFields(
                { name: 'Duration', value: queue.formattedDuration, inline: true },
                { name: 'Now', value: `${hours}:${minutes}:${seconds}`, inline: true },
            )
            return interaction.reply({ embeds: [embed4] });

        } catch (err) {
            const embed5 = new EmbedBuilder()
            .setColor('Red')
            .setDescription("An error occurred! Try again!")
            console.log(err);
            return interaction.reply({ embeds: [embed5] });
        }
    }
};