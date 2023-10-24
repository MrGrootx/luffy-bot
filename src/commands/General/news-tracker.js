const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios')

const NewsAPIKEY = process.env.NewsAPIKEY 
const NewsAPIEndpoint = 'https://newsapi.org/v2/top-headlines';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('news-tracker')
    .setDescription('Get the latest news')
    .addStringOption(option =>
        option
        .setName('country')
        .setDescription('which country news you want to see')
        .setRequired(true)
        .addChoices(
           
            { name: "United States", value: "us" },
            { name: "India", value: "in" },
            { name: "United Kingdom", value: "gb" },
            { name: "France", value: "fr" },
            { name: "Germany", value: "de" },
            { name: "Italy", value: "it" },
            { name: "Spain", value: "us" },
            { name: "Canada", value: "ca" },
            { name: "Brazil", value: "br" },
            { name: "Russia", value: "ru" },
            { name: "Turkey", value: "tr" },
            { name: "Israel", value: "il" },
            { name: "Austria", value: "at" },
            { name: "Netherlands", value: "nl" },
            { name: "Sweden", value: "se" },
            { name: "Switzerland", value: "ch" },
            
        )),

    async execute(interaction, client) {

        const country = interaction.options.getString('country');

        const { guild, member } = interaction;
        const response = await axios.get(NewsAPIEndpoint, {
            params: {
                country: country, // Add ur countys abbreviation to get their data found here: https://newsapi.org/docs/endpoints/sources
                apiKey: NewsAPIKEY,
            },
        });

        if (response.data.articles && response.data.articles.length > 0) {
            const articles = response.data.articles;
            const randomIndex = Math.floor(Math.random() * articles.length);
            const randomArticle = articles[randomIndex];

            const embed = new EmbedBuilder()
            .setTitle(randomArticle.title)
            .setImage("https://media.discordapp.net/attachments/1165269900944756776/1166304118076346448/pngwing.com.png?ex=654a005a&is=65378b5a&hm=4665c135e6c36681ebef33eb6d194e250fd3d22f0db9e385affc25aec1c1990d&=&width=706&height=676")
            .addFields(
                {name: "Author", value: `${randomArticle.author}`},
                {name: "Source", value: `${randomArticle.source.id} & ${randomArticle.source.name}`},
                {name: "Published", value: `${randomArticle.publishedAt}`}
            )
            .setURL(randomArticle.url)
            .setTimestamp()
            .setFooter({text: `News-tracker | Requested By ${interaction.user.username}`, iconURL: member.displayAvatarURL()})

            await interaction.reply({ embeds: [embed]})
            .catch((err) => {
                interaction.editReply({ content: `An **error** occured!\n> **Error**: ${err}`, ephemeral: true});
            });

        }
    }
}