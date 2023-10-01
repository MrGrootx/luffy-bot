const { SlashCommandBuilder, EmbedBuilder,PermissionsBitField } = require("discord.js");

const { Code } = require("../../schemas.js/codeSchema");

const MESSAGE = {
  USER_NOT_PREMIUM:
    "You are not a premium user",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("premium-status")
    .setDescription("Check if a user is a premium status"),
    // .addUserOption((option) =>
    //   option
    //     .setName("user")
    //     .setDescription("The user to check")
    //     .setRequired(false)
    // ),

    async execute (interaction) {
        // const targetuserid =  interaction.options.getUser('user')?.id || interaction.user.id;
        const targetuserid =  interaction.user.id;
       

        const code = await Code.findOne({ "redeemedBy.id": targetuserid});


        if (!code) {
            const embed = new EmbedBuilder()
            .setDescription(MESSAGE.USER_NOT_PREMIUM)
            .setColor('NotQuiteBlack')
            .setTimestamp()

            await interaction.reply({ embeds: [embed], ephemeral: true});
            return;

        }

        const activatedOn = `<t:${Math.floor(code.redeemedOn.getTime() / 1000)}:R>`;
        const expiresAt = `<t:${Math.floor(code.expiresAt.getTime() / 1000)}:R>`;

        const embed = new EmbedBuilder()
        .setAuthor({ name: 'Premium Status', iconURL: interaction.client.user.displayAvatarURL()})
        .setDescription(`The user <@${targetuserid}> is currently a premium user..`)
        .addFields(
            {name: 'Code', value: code.code, inline: true},
            {name: 'Activated On', value: activatedOn, inline: true},
            {name: 'Expires At', value: expiresAt, inline: true},
        )
        .setColor('NotQuiteBlack')
        .setTimestamp()

        await interaction.reply({ embeds: [embed], ephemeral: true });

    }
    
};
