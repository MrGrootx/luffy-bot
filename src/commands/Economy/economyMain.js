const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");

const accountSchema = require("../../schemas.js/Eco-Account");

const economy = require('../../commands/Economy/config/Eco-emoji.json')

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
          return interaction.reply({ content: `**You already have an account**`, ephemeral: true });

        Data = new accountSchema({
          Guild: interaction.guild.id,
          User: user.id,
          Bank: 0,
          Wallet: 100,
        });

        await Data.save();

        // interaction.reply({
        //   content: `Account created You Got ${Data.Wallet} at your wallet`,
        // });

        interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setColor('NotQuiteBlack')
            .setTitle(`${economy.embed.successfullytic} Your Economy account has been successfully created`)
            .setDescription(`* You Got **${Data.Wallet}$** at your wallet`)
            .setFooter({ text: 'Economy System' })
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({size:64}))
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })

            // .addFields(
            //   { name: `${economy.economy.bank} Bank`, value: Data.Bank.toString(), inline: true },
            //   { name: `${economy.economy.wallet} Wallet`, value: Data.Wallet.toString(), inline: true },
            //   { name: `${economy.economy.total} Total`, value: (Data.Wallet + Data.Bank).toString(), inline: true }
            // )
            .addFields(
              { name: ` `, value: ` ${economy.economy.bank} **Bank**: ${Data.Bank.toString()}`, inline: true },
              { name: ` `, value: ` ${economy.economy.wallet} **Wallet**: ${Data.Wallet.toString()}`, inline: true },
              { name: ` `, value: ` ${economy.economy.total} **Total**:  ${(Data.Wallet + Data.Bank).toString()}`, inline: true }
            )
          ]
        })

        break;

      case "balance":
        {
          if (!Data)
            // return interaction.reply({
            //   content: `You Don't have Economy account.. First Create Account`,
            //   ephemeral: true,
            // });

            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription(`You Don't Have **Economy Account** Create a account and Try again..!`)
                .setFooter({ text: 'Economy System' })
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL({size:64}))
                
              ]
            })

          const embed = new EmbedBuilder()
            .setColor('NotQuiteBlack')
            .setTitle(`Account Balance`)
            .setFooter({ text: 'Economy System' })
            .setTimestamp()
            // .setAuthor({ name: `Account Name: ${interaction.user.username}`})
            .addFields({ name: ' ', value: `**Account Name**: ${interaction.user.username}`})
            .addFields(
              { name: ` `, value: ` ${economy.economy.bank} **Bank**: ${Data.Bank.toString()}`, inline: true },
              { name: ` `, value: ` ${economy.economy.wallet} **Wallet**: ${Data.Wallet.toString()}`, inline: true },
              { name: ` `, value: ` ${economy.economy.total} **Total**:  ${(Data.Wallet + Data.Bank).toString()}`, inline: true }
            )


          await interaction.reply({ embeds: [embed] });
        }

        break;

      case "delete":
        {
          if (!Data)
            return interaction.reply({
              content: `You Don't have Economy account to Delete`,
              ephemeral: true,
            });

          await Data.delete();

          // interaction.reply({
          //   content: "Your Economy Account for this server has been Deleted",
          // });

          interaction.reply({
            embeds: [
              new EmbedBuilder()
              .setColor('Red')
              .setDescription(`Your **Economy Account** has been Deleted`)
              .setTimestamp()
            ]
          })
        }
        break;
    }
  },
};
