const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Get Bot Uptime.."),

  async execute(interaction, client) {
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24; // 1 Day = 24 Hours
    const minutes = Math.floor(client.uptime / 60000) % 60; // 1 Hour = 60 Minutes
    const seconds = Math.floor(client.uptime / 1000) % 60; // 1 Minute = 60 Seconds

    const embed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setTitle(`\`\` ${client.user.username} Uptime Info \`\``)
      .setThumbnail(client.user.displayAvatarURL({ size:32 }))
      .setDescription(
        ` \`\` **Uptime** : ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds \`\``
      );

      interaction.reply({ embeds: [embed] });
  },
};

/**
 *Coded By : Mr Groot#9862
 */
