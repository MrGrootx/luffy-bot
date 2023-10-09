const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-list")
    .setDescription("Lists all the server the bot is currently in."),
  devOnly: true,

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction, client) {
    const serversList = client.guilds.cache.map((guild) => {
      const members = guild.members.cache;
      const humanMembers = members.filter((member) => !member.user.bot).size;
      const botMembers = members.filter((member) => member.user.bot).size;
      
      const totalMembers = members.size;
      return {
        name: guild.name,
        id: guild.id,
        humanMembers,
        botMembers,
        totalMembers,
      };
    });

    serversList.sort((a, b) => b.totalMembers - a.totalMembers); //Sort by number of total members from highest to lowest
    const guild = interaction.guild;
    const owner = guild.members.cache.get(guild.ownerId);
    const formattedServersList = serversList.map((server) => {
      return `> **${server.name}**\n> **Server ID**: (${server.id}) \n> **Owner ID**: ${owner.user.tag} (${owner.user.id})\nHumans: ${server.humanMembers}, Bots: ${server.botMembers}, Total: ${server.totalMembers}`;
    });

    const embed = new EmbedBuilder()
      .setTitle("``💾`` Total Server List")
      .setDescription(
        `The bot is located on the following servers:\n\n${formattedServersList.join(
          "\n\n"
        )}`
      )
      .setColor("NotQuiteBlack")
      .setFooter({ text: `Under Luffy Control`, iconURL: client.user.displayAvatarURL()})

    await interaction.reply({ embeds: [embed] });
  },
};
