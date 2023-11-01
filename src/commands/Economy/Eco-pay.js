const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  PermissionFlagsBits,
} = require("discord.js");

const accountSchema  = require("../../schemas.js/Eco-Account");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("economy-pay")
    .setDescription("Pay someone money in the economy system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to remove money")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The user to remove money")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { user, options, guild } = interaction;

    const Member = options.getUser("user");
    let amount = options.getNumber("amount");

    const sender = user;

    let data = await accountSchema
    .findOne({ Guild: interaction.guild.id, User: user.id })
    .catch((err) => {});

    if (!data)
      return interaction.reply({
        content: `You Don't Have Economy Account Please Create First`,
        ephemeral: true,
      });



    let Data = await accountSchema
    .findOne({ Guild: interaction.guild.id, User: Member.id })
    .catch((err) => {});

    if (!Data)
      return interaction.reply({
        content: `The user has no economy account`,
      });

    const Sender = await accountSchema.findOne({
      Guild: interaction.guild.id,
      User: sender.id,
    });


    const MoneyReceiver = await accountSchema.findOne({
      Guild: interaction.guild.id,
      User: Member.id,
    });

    if(Sender.Wallet < amount) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('NotQuiteBlack')
                .setDescription(`You don't have enough money to pay ${Member.username}\nYou have: ${Sender.Wallet}$\nAccount: ${amount}$`)
            ], ephemeral: true
        })
    }

    if(sender === Member) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('NotQuiteBlack')
                .setDescription(`You can't send money to yourself`)
            ], ephemeral: true
        })
    }

    const dataSend = await accountSchema.findOne({
        Guild: interaction.guild.id,
        User: sender.id,
      });

      dataSend.Wallet -= amount;
      dataSend.save();
  
      const DataReceived = await accountSchema.findOne({
        Guild: interaction.guild.id,
        User: Member.id,
      });
  
      DataReceived.Wallet += amount;
      DataReceived.save();

      interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setColor('NotQuiteBlack')
            .setDescription(`You sended ${amount}$ to ${Member}`)
        ], ephemeral: true
    })

  },
};
