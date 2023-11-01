const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");

const accountSchema = require("../../schemas.js/Eco-Account");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("economy")
    .setDescription("Create/delete/check your economy account balance")
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Choose an option")
        .setRequired(true)
        .addChoices(
          { name: "Create", value: "create" },
          { name: "Balance", value: "balance" },
          { name: "Delete", value: "delete" }
        )
    ),

  async execute(interaction) {
    const { options, user, guild } = interaction;

    let Data = await accountSchema
      .findOne({ Guild: interaction.guild.id, User: user.id })
      .catch((err) => {});

    switch (options.getString("options")) {
      case "create":
        if (Data)
          return interaction.reply({ content: `You already have an account` });

        Data = new accountSchema({
          Guild: interaction.guild.id,
          User: user.id,
          Bank: 0,
          Wallet: 1000,
        });

        await Data.save();

        interaction.reply({
          content: `Account created You Got ${Data.Wallet} at your wallet`,
        });
        break;

      case "balance":
        {
          if (!Data)
            return interaction.reply({
              content: `You Don't have Economy account.. First Create Account`,
              ephemeral: true,
            });

          const embed = new EmbedBuilder()
            .setTitle(`Economy Account Balance`)
            .setDescription(
              `Wallet: ${Data.Wallet}\nBank: ${Data.Bank}\nTotal ${
                Data.Wallet + Data.Bank
              }$`
            )
            .setColor("NotQuiteBlack");

          await interaction.reply({ embeds: [embed] });
        }

        break;

      case "delete":
        {
          if (!Data)
            return interaction.reply({
              content: `You Don't have Economy account.. First Create Account`,
              ephemeral: true,
            });

          await Data.delete();

          interaction.reply({
            content: "Your Economy Account for this server has been Deleted",
          });
        }
        break;
    }
  },
};
