const { Code } = require("../../schemas.js/codeSchema");

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-allpremium")
    .setDescription("view all premium codes")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const codes = await Code.find({ "redeemed.id": { $ne: null } });
    const users = codes.map((code) => code.redeemedBy);

    if (users.length > 0) {
      const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setAuthor({
          name: "Premium Codes",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setDescription("List of all users who have redeemed a premium code:")
        .addFields(
          users.map((user) => {
            return {
              name: `${user.username}`,
              value: `\`${user.id}\``,
              inline: true,
            };
          })
        );

      return interaction.reply({ embeds: [embed] });
    } else {
        const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setDescription("No Permium codes have been redeemed do far..!")

     return interaction.reply({ embeds: [embed] });   
    }
  },
};
