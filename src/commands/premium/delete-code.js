const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { Code } = require('../../schemas.js/codeSchema');

const ERROR_MESSAGE = {
    CODE_NOT_FOUND: 'The code tou entered is invalid. please check your code and try again later',
    CODE_ALREADY_REDEEMED: 'The code you entered has already been redeemed',
    EXPIRATION_DATE_NOT_FOUND: "The code you entered doesn't have an expiration date",
    CONFIRMATION_TIME_OUT: "The confirmation time has expired. Please try again later",
    COMMAND_EXECUTION_ERROR: 'An error occured while executing this command'
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delete-code')
    .setDescription('Delete a premium code')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => 
    option
    .setName('code')
    .setDescription('The premium code to delete')
    .setRequired(true)
    ),

    async execute(interaction) {
        try {
            const codeValue = interaction.options.getString('code');
            const code = await Code.findOne({ code: codeValue });

            if(!code) {
                const embed = new EmbedBuilder()    
                .setColor('NotQuiteBlack')
                .setAuthor({ name: 'Code Deletion Failed', iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(ERROR_MESSAGE.CODE_NOT_FOUND)

                await interaction.reply({ embeds: [embed], ephemeral: true})
                return;
            }

            if(code.redeemedBy && code.redeemedBy.username && code.redeemedBy.id) {
                const confirmembed = new EmbedBuilder()
                .setColor('NotQuiteBlack')
                .setAuthor({ name: 'Code Deletion Confirmation', iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(`Are you sure you want to delete to code "${codeValue}"?\n\nType \`!delete ${codeValue}\` to confirm`)

                const message = await interaction.reply({ embeds: [confirmembed], ephemeral: true });

                const filter = (msg) => 
                msg.author.id === interaction.user.id &&
                msg.content.toLowerCase() === `!delete ${codeValue}`;

                const collector = interaction.channel.createMessageCollector({
                    filter,
                    time: 10000,
                });

                collector.on('collect' , async (msg) => {
                    await msg.delete();
                    await Code.deleteOne({ _id: code._id })

                    const embed = new EmbedBuilder()
                    .setColor('NotQuiteBlack')
                    .setAuthor({ name: 'Code Deleted', iconURL: interaction.client.user.displayAvatarURL()})
                    .setDescription(`The Code has Been Deleted`)
                    .setTimestamp()

                    await interaction.editReply({ embeds: [embed]});
                    });

                    collector.on('end', async (collected) => {
                        if(collected.size === 0) {
                            const embed = new EmbedBuilder()
                            .setColor('NotQuiteBlack')
                            .setAuthor({ name: 'Code Deletion Failed', iconURL: interaction.client.user.displayAvatarURL()})
                            .setDescription(ERROR_MESSAGE.CONFIRMATION_TIME_OUT)
                            .setTimestamp()
        
                            await interaction.editReply({ embeds: [embed]});
                        }
                    })
                    return;


            }

            await Code.deleteOne({ _id: code._id})
            const embed = new EmbedBuilder()
                    .setColor('NotQuiteBlack')
                    .setAuthor({ name: 'Code Deleted', iconURL: interaction.client.user.displayAvatarURL()})
                    .setDescription(`The Code has Been Deleted`)
                    .setTimestamp()

                    await interaction.editReply({ embeds: [embed], ephemeral: true});
        } catch (error) {
            const embed = new EmbedBuilder()
                    .setColor('NotQuiteBlack')
                    .setDescription(ERROR_MESSAGE.COMMAND_EXECUTION_ERROR)
                    .setTimestamp()

                    await interaction.editReply({ embeds: [embed], ephemeral: true});
        }
    }
}