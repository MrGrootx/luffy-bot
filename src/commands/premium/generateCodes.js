const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const  {Code}  = require('../../schemas.js/codeSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate-code')
        .setDescription('Ganerate a premium codes')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName('length')
                .setDescription('The length of the code should be valid..')
                .setRequired(true)
                .addChoices(
                    {
                        name: '1 day',
                        value: 'daily'
                    },
                    {
                        name: '7 day',
                        value: 'weekly'
                    },
                    {
                        name: '30 days',
                        value: 'monthly'
                    },
                    {
                        name: '365 days',
                        value: 'yearly'
                    },
                )
        ),

        async execute (interaction) {

            // const validlengths = ['daily', 'weekly', 'monthly', 'yearly'];
            // const codeType = validlengths.includes(codelength) ? codelength : 'daily';
            const codeType = interaction.options.getString('length');

            const code = Math.random().toString(36).substring(2,8);
            const newcode = new Code({
                code,
                length: codeType,
            });

            try {
                await newcode.save()
                const embed = new EmbedBuilder()
                .setAuthor({ name: 'Code Generated', iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription('Your code has been successfully generated!')
                .addFields(
                    { name: "code", value: `${code}`, inline: true},
                    { name: 'length', value: `${codeType}`, inline: true},
                )
                .setColor('NotQuiteBlack')
                .setTimestamp()
                await interaction.reply({ embeds: [embed], ephemeral: true});
                
            } catch (error) {
                console.error(error);

                const embed = new EmbedBuilder()
                .setDescription('An error accured while generating the code. Please try again later..')
                .setColor('NotQuiteBlack')
                .setTimestamp()
                await interaction.reply({ embeds: [embed], ephemeral: true});
            }
        }
}