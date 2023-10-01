const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { Code } = require("../../schemas.js/codeSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("redeem-code")
        .setDescription("Redeem a premium code")
        .addStringOption((option) =>
            option
                .setName("code")
                .setDescription("The Premium code to redeem..")
                .setRequired(true)

        ),

        async execute (interaction) {
            const userId = interaction.user.id;
            const codeValue = interaction.options.getString("code");
            

            try {
                // const code = await Code.find({ code: codeValue});

                // if(!code) {
                //     const embed = new EmbedBuilder()
                //     .setColor('NotQuiteBlack')
                //     .setDescription(`The Code you entered is invaild. please check your code and try again.`)
                //     .setTimestamp()

                //     await interaction.reply({ embeds: [embed] , ephemeral: true});
                //     return;
                // }

                // if(code.redeemedBy && code.redeembedBy.id) {
                //     const embed = new EmbedBuilder()
                //     .setColor('NotQuiteBlack')
                //     .setTimestamp()
                //     .setDescription(`The Code you entered has already been redeemed.`)
                //     await interaction.reply({ embeds: [embed] , ephemeral: true});
                //     return;
                // }

                const code = await Code.findOne({ code: codeValue });

                if (!code) {
                    const embed = new EmbedBuilder()
                        .setColor('NotQuiteBlack')
                        .setDescription(`The Code you entered is invalid. Please check your code and try again.`)
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }

                if (code.redeemedBy && code.redeemedBy.id) {
                    const embed = new EmbedBuilder()
                        .setColor('NotQuiteBlack')
                        .setTimestamp()
                        .setDescription(`The Code you entered has already been redeemed.`);

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }


                // changed findOne to find
                const existingCode =  await Code.findOne({
                    "redeemedBy.id": userId,

                });

               

                if(existingCode) {
                    const embed = new EmbedBuilder()
                    .setColor('NotQuiteBlack')
                    .setTimestamp()
                    .setDescription(`You Have alreaday redeemed a code. You cannot redeem another one..`)
                    await interaction.reply({ embeds: [embed] , ephemeral: true});
                    return;
                }

                const codeExpiration = new Date();
                const codelength = code.length;
                const expirationLengths = {
                    daily: 1,
                    weekly: 7,
                    monthly: 30,
                    yearly: 365,
                    "14 days" : 14,
                    "30 days" : 30,
                    "60 days" : 60,
                    "90 days" : 90,
                }

                const expirationLength = expirationLengths[codelength] || parseInt(codelength);
                if(isNaN(expirationLength)) {
                    const embed = new EmbedBuilder()
                    .setColor('NotQuiteBlack')
                    .setTimestamp()
                    .setDescription(`The Code you entered has an invalid length`)
                    await interaction.reply({ embeds: [embed] , ephemeral: true});
                    return;
                }
                codeExpiration.setDate(codeExpiration.getDate() + expirationLength);

                const redeemedUser = {
                    id: interaction.user.id,
                    username: interaction.user.username,
                };

                const redeemedOn = new Date();

                await Code.updateOne(
                    { code: codeValue},
                    {
                        $set: {
                            redeemedBy: redeemedUser,
                            redeemedOn: redeemedOn,
                            expiresAt: codeExpiration,
                        }
                    }
                );

                const embed = new EmbedBuilder()
                .setColor('NotQuiteBlack')
                .setAuthor({ name: 'Code Redeemed', iconURL: interaction.user.displayAvatarURL()})
                .setDescription(`You have successfully redeemed the code`)
                .addFields(
                    { name: 'Code', value: `${codeValue}`, inline: true},
                    { name: 'length', value: `${codelength} days`, inline: true},
                    {name: 'Expires In', value: `<t:${Math.floor(codeExpiration.getTime() / 1000)}:R>`, inline: true}
                )
                .setTimestamp()

                await interaction.reply({ embeds: [embed] , ephemeral: true});  

            } catch (error) {
                console.log(error);
                const embed = new EmbedBuilder()
                .setDescription('An error accured while redeem the code. Please try again later..')
                .setColor('NotQuiteBlack')
                .setTimestamp()

                await interaction.reply({ embeds: [embed] , ephemeral: true});
            }
        }
};
