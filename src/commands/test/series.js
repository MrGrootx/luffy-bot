const { SlashCommandBuilder, MessageActionRow, MessageButton, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const { ActionRowBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('series')
        .setDescription('Gets information about a TV series, rating, description, and much more')
        .addStringOption(option => option.setName('name').setDescription('The name of the TV series').setRequired(true)),

    async execute(interaction, client) {
        const themvoiedbapi = process.env.themvoiedbapi;

        const { options, member, guild } = interaction;
        const name = options.getString("name");
        const apiUrl = `https://api.themoviedb.org/3/search/tv?api_key=${themvoiedbapi}&query=${encodeURIComponent(name)}`;
        const response = await axios.get(apiUrl);

        const series = response.data.results[0];

        if (series) {
            const ratingStars = generateStarRating(series.vote_average);

            const url = `https://www.themoviedb.org/tv/${series.id}`;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('View on TMDB')
                        .setStyle(ButtonStyle.Link)
                        .setURL(url)
                );

            const embed = new EmbedBuilder()
                .setAuthor({ name: "TV Series Command", iconURL: guild.iconURL({ size: 2048 }) })
                .setTitle(series.name)
                .setURL(url)
                .setImage(`https://image.tmdb.org/t/p/w500${series.poster_path}`)
                .addFields(
                    { name: "First Air Date", value: `**${series.first_air_date || 'Not available'}**` },
                    { name: "Overview (Description)", value: `**${series.overview || 'Not available'}**` },
                    { name: "Popularity <:Popular:1172505497149132830>", value: `**${series.popularity || 'Not available'}**` },
                    { name: "Language <:Language:1172506038658924696>", value: `**${series.original_language || 'Not available'}**` },
                    { name: "Average Vote", value: `**${ratingStars}**` })
                .setFooter({ text: "Search TV Series", iconURL: member.displayAvatarURL() })
                .setColor('#f3ce13')
                .setTimestamp();

            try {
                // Reply to the interaction with the embed and button
                await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            } catch (err) {
                console.error(`Error replying to interaction: ${err}`);
            }
        } else {
            try {
                // Reply to the interaction if the TV series doesn't exist
                await interaction.reply({ content: "A TV series with that title doesn't exist. Make sure you've got the correct title :)", ephemeral: true });
            } catch (err) {
                console.error(`Error replying to interaction: ${err}`);
            }
        }
    },
};

function generateStarRating(voteAverage) {
    const maxStars = 10;
    const fullStarEmoji = '<:Star:1172485703737815125>';
    const halfStarEmoji = '<:Halfstar:1172485717671280650>';

    const rating = [];
    let remainingStars = Math.round((voteAverage / 1));

    for (let i = 0; i < Math.floor(voteAverage / 1); i++) {
        rating.push(fullStarEmoji);
    }

    if (voteAverage % 1 !== 0) {
        rating.push(halfStarEmoji);
        remainingStars--;
    }

    for (let i = 0; i < remainingStars; i++) {
        rating.push(' '); // Add your empty star emoji here
    }

    return `${rating.join('')} (${voteAverage}/10)`;
}
