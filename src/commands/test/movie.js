const { SlashCommandBuilder, MessageActionRow, MessageButton, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const { ActionRowBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movie')
        .setDescription('Gets information about a movie, rating, description and much more')
        .addStringOption(option => option.setName('name').setDescription('The name of the movie').setRequired(true)),

    async execute(interaction, client) {
        const themvoiedbapi = process.env.themvoiedbapi;

        const { options, member, guild } = interaction;
        const name = options.getString("name");
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${themvoiedbapi}&query=${encodeURIComponent(name)}`;
        const response = await axios.get(apiUrl);

        const movie = response.data.results[0];

        if (movie) {
            const starRating = generateStarRating(movie.vote_average);

            const url = `https://www.themoviedb.org/movie/${movie.id}`
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('View on TMDB')
                        .setStyle(ButtonStyle.Link)
                        .setURL(url)
                );

            const embed = new EmbedBuilder()
                .setAuthor({ name: "Movie Command", iconURL: guild.iconURL({ size: 2048 }) })
                .setTitle(movie.title)
                .setURL(`https://www.themoviedb.org/movie/${movie.id}`)
                .setImage(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
                .addFields(
                    { name: "Release Date", value: `**${movie.release_date}**` },
                    { name: "Overview (Description)", value: `**${movie.overview}**` },
                    { name: "Popular! <:Popular:1172505497149132830>", value: `**${movie.popularity}**` },
                    { name: `Language <:Language:1172506038658924696>`, value: `**${movie.original_language}**` },
                    { name: "Average Vote", value: `**${starRating}**` },
                    { name: "**Age Rating**", value: `Adult - ${movie.adult}` })
                .setFooter({ text: "Search Movie", iconURL: member.displayAvatarURL() })
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
                // Reply to the interaction if the movie doesn't exist
                await interaction.reply({ content: "A movie with that title doesn't exist. Make sure you've got the correct title :)", ephemeral: true });
            } catch (err) {
                console.error(`Error replying to interaction: ${err}`);
            }
        }
    },
};

function generateStarRating(voteAverage) {
    const maxStars = 10;
    const starCount = Math.floor((voteAverage / 10) * maxStars);
    const fullStars = '<:Star:1172485703737815125>'.repeat(starCount);
    const halfStar = ((voteAverage % 10) >= 5 && starCount < maxStars) ? '<:Halfstar:1172485717671280650>' : '';
    const emptyStarsCount = maxStars - starCount - (halfStar.length ? 1 : 0);
    const emptyStars = ''.repeat(emptyStarsCount);

    return `${fullStars}${halfStar}${emptyStars} (${voteAverage}/10)`;
}
