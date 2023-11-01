const {
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    PermissionFlagsBits,
  } = require("discord.js");
  
  const accountSchema = require("../../schemas.js/Eco-Account");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("economy-remove")
      .setDescription("Remove someone money in the economy system")
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
  
      let Data = await accountSchema
        .findOne({ Guild: interaction.guild.id, User: Member.id })
        .catch((err) => {});
  
      if (!Data)
        return interaction.reply({
          content: `The user has no economy account`,
        });
  
      const MoneyReceiver = await accountSchema.findOne({
        Guild: interaction.guild.id,
        User: Member.id,
      });

      if (MoneyReceiver.Wallet < amount) return interaction.reply({
          content: `user don't have enough money to remove`,
          ephemeral: true
      });
  
      const DataReceived = await accountSchema.findOne({
        Guild: interaction.guild.id,
        User: Member.id,
      });
  
      DataReceived.Wallet -= amount;
      DataReceived.save();
  
      interaction.reply({
          embeds: [
              new EmbedBuilder()
              .setColor('NotQuiteBlack')
              .setDescription(`Remove ${amount}$ to ${Member.username}`)
          ],
      })
    },
  };
  