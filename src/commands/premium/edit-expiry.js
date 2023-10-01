const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { Code } = require("../../schemas.js/codeSchema");

const ERROR_MESSAGE = {
  CODE_NOT_FOUND: "The code you entered is not found",
  EXPIRY_EDIT_FAILED: "The expiry date of the code couldn't be updated",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit-expiry")
    .setDescription("Edit the expiry date of a code")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to edit")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("days")
        .setDescription("The number of days to add to the expiry data")
        .setRequired(true)
        .addChoices(
          { name: "1 day", value: 1 },
          { name: "3 days", value: 3 },
          { name: "7 days", value: 7 },
          { name: "14 days", value: 14 },
          { name: "30 days", value: 30 },
          { name: "60 days", value: 60 }
        )
    ),

  async execute(interaction) {
    const codeValue = interaction.options.getString("code");
    const daysToAdd = interaction.options.getInteger("days");

    try {
      const code = await Code.findOne({ code: codeValue });
      if (!code) {
        const embed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setAuthor({
            name: "Edit Expiry Failed",
            iconURL: interaction.client.user.displayAvatarURL(),
          })
          .setDescription(ERROR_MESSAGE.CODE_NOT_FOUND);

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      let newExpiry;
      if (code.redeemedBy && code.redeemedBy.id) {
        newExpiry = new Date(code.expiresAt.getTime() + daysToAdd * 86400000);

        await Code.updateOne(
          { code: codeValue },
          { $set: { expiresAt: newExpiry } }
        );
      } else {
        const length = Object.keys(code)[0];

        await code.updateOne(
          { code: codeValue },
          { $set: { length: `${daysToAdd} days` } }
        );
      }

      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Expiry Updated",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setDescription(
          "The expiry date of the code has been successfully updated"
        )
        .addFields({ name: "Code", value: `${code.code}`, inline: true })
        .setColor("NotQuiteBlack");
      if (newExpiry) {
        embed.addFields({
          name: "New Expiry",
          value: `<t:${Math.floor(newExpiry.getTime() / 1000)}:R>`,
          inline: true,
        });
      } else {
        embed.addFields({
          name: "New Length",
          value: `${daysToAdd} days`,
          inline: true,
        });
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setAuthor({
          name: "Edit Expiry Failed",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setDescription(ERROR_MESSAGE.EXPIRY_EDIT_FAILED);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
