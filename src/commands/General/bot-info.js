const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription('bot info'),

  async execute(interaction, client) {
    const icon = client.user.displayAvatarURL({ size: 64 });
    const tag = interaction.user.tag;

    // Uptime
    const uptime = process.uptime();
    const uptimeString = formatUptime(uptime);

    const { guild } = interaction; // Member Count
    const commandCount = interaction.client.commands.size; // Command Count
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Memory Usage
    const cpuUsage = process.cpuUsage().user / 1000000; // CPU Usage
    const botVersion = "1.0.0"; // BOT Version

    const embed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .addFields(
        { name: '``💹`` UpTime', value: `${uptimeString}`, inline: true },
        { name: '``📈`` Bots Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '``📅`` Created At', value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '``🎰`` Command Count', value: `${commandCount}`, inline: true },
        { name: '``📊``Memory Usage', value: `${memoryUsage} MB`, inline: true },
        { name: '``💾`` CPU Usage', value: `${cpuUsage} ms`, inline: true },
        { name: '``🤖`` Bot Version', value: `${botVersion}`, inline: true },
        { name: '``🛬`` Made with', value: `Javascript`, inline: true},
        { name: ` `, value: ' ', inline: true}

        )
        .setFooter({ text: `Hey there it's Me ${client.user.username}`, iconURL: `${icon}`})


    await interaction.reply({ embeds: [embed] });

  },
};

function formatUptime(uptime) {
  const seconds = Math.floor(uptime % 60);
  const minutes = Math.floor((uptime / 60) % 60);
  const hours = Math.floor((uptime / (60 * 60)) % 24);
  const days = Math.floor(uptime / (60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
