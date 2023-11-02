const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const accountSchema = require("../../schemas.js/Eco-Account");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("economy-deposit")
    .setDescription("deposit money from your wallet into your bank.")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("Deposit amount")
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
        content: `You Don't have Economy account.. First Create Account`,
      });

    if (Amount.toLowerCase() === "all") {
      if (Data.Wallet === 0)
        return interaction.reply({
          content: `You Don't have any money in your wallet to deposit it into your bank`,
        });

      Data.Bank += Data.Wallet;
      Data.Wallet = 0;

      await Data.save();

      return interaction.reply({
        content: `All Your money has been deposited..`,
      });
    } else {
      const converted = Number(Amount);

      if (isNaN(converted) === true)
        return interaction.reply({
          content: "The amount can only be a number or `all` ",
          ephemeral: true,
        });

      if (Data.Wallet < parseInt(converted) || converted === Infinity)
        return interaction.reply({
          content: `You Don't have any money in your wallet to deposit it into your Bank`,
        });

      // if (Data.Wallet < converted) {
      //   return interaction.reply({
      //     content: `You don't have enough money in your wallet to deposit ${converted}$ into your bank.`,
      //   });
      // }

        Data.Bank += parseInt(converted);
        Data.Wallet -= parseInt(converted);
        // Data.Wallet = Math.abs(Data.Bank)

        await Data.save()

        const embed = new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setDescription(`Successfully ${parseInt(converted)}$ deposited into your bank..`)

        return interaction.reply({ embeds: [embed] })
    }
  },
};
