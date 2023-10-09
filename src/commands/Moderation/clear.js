const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("delete channel sended message")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of message to delete")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger("amount");
    const channel = interaction.channel;

    // who can run this command
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    )
      return await interaction.reply({
        content: "You don't have **ManageMessages** permissions to run this command",
        ephemeral: true,
      });

      
    if (!amount)
      return await interaction.reply({
        content: "please specify the amount of message you want to delete",
        ephemeral: true,
      });
    if (amount > 100 || amount < 1)
      return await interaction.reply({
        content: "please select a number *between* 100 and 1",
        ephemeral: true,
      });

    await interaction.channel.bulkDelete(amount).catch((err) => {
      return;
    });

    const embed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setDescription(`:white_check_mark: Deleted **${amount}** message.`);

    await interaction
      .reply({ embeds: [embed], ephemeral: true })
      .catch((err) => {
        return;
      });
  },
};


/**  
 *Coded By : Mr Groot#9862
*/
