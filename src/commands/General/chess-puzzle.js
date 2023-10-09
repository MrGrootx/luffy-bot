const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess-puzzle')
        .setDescription('Get a random solvable chess puzzle'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        try {
            const response = await axios.get('https://api.chess.com/pub/puzzle/random');
            const puzzle = response.data;

            if (puzzle.fen && puzzle.pgn) {
                const embed = new EmbedBuilder()
                .setColor('NotQuiteBlack')
                .setTitle('Chess Puzzle')
                .setDescription('Solve the puzzle:')
                .addFields({ name: 'FEN Position', value: `${puzzle.fen}`})
                .addFields({ name: 'PGN Notation',  value: `${puzzle.pgn}`})

                await interaction.editReply({ embeds: [embed] })};
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error! Try again later.' });
        }
    },
};


/**
 *Coded By : Mr Groot#9862
 */