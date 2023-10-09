const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("password-generator")
    .setDescription("generate a password")
    .addNumberOption((option) =>
      option
        .setName("length")
        .setDescription("length of password")
        .setRequired(true)
        .setMinValue(4)
        .setMaxValue(20) 
    ),
  async execute(interaction) {
    const length = interaction.options.getNumber("length");

    if (length < 4)
      return interaction.reply({
        content: "**Password length must be at least 4 characters**",
        ephemeral: true,
      });


    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@";

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    const embed = new EmbedBuilder()
      .setColor('NotQuiteBlack')
      .setDescription(
        `:satellite: Your password has been generated  \`\`\`${password}\`\`\` `
      );

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};


/**
 *Coded By : Mr Groot#9862
 */