const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const accountSchema = require("../../schemas.js/Eco-Account");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("economy-withdraw")
    .setDescription("withdraw money from your balance")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("Withdraw amount")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, user, guild } = interaction;

    const Amount = options.getString("amount");

    let Data = await accountSchema
      .findOne({ Guild: interaction.guild.id, User: user.id })
      .catch((err) => {});

    if (!Data)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `You Don't Have **Economy Account** Create a account and Try again..!`
            )
            .setFooter({ text: "Economy System" })
            .setTimestamp()
        ],
      });


    if (Amount.toLowerCase() === "all") {
      if(Data.Bank === 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setColor("Red")
            .setDescription("You Don't have any money in your bank to withdraw it into your wallet")
          ],
          ephemeral: true
      })

        Data.Wallet += Data.Bank;
        Data.Bank = 0;

      await Data.save();

      return interaction.reply({
        // content: `All Your money has been withdrawed..`,
        embeds: [
          new EmbedBuilder()
          .setColor("Green")
          .setDescription("All Your money has been withdrawed..")
        ]

      });
    } else {
      const converted = Number(Amount);

      if (isNaN(converted) === true)
        return interaction.reply({
          content: "the amount can only be a number or `all` ",
          ephemeral: true,
        });

      if (Data.Bank < parseInt(converted) || converted === Infinity)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setColor("Red")
            .setDescription("You Don't have any money in your bank to withdraw it into your wallet")
          ],
          ephemeral: true
        });

        Data.Wallet += parseInt(converted);
        Data.Bank -= parseInt(converted);
        // Data.Bank = Math.abs(Data.Bank)

        await Data.save()

        const embed = new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setDescription(`Successfully ${parseInt(converted)}$ withdrawed into your wallet..`)

        return interaction.reply({ embeds: [embed] })
    }
  },
};
