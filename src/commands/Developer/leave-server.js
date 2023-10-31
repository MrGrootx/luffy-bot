const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  devOnly: true,
  data: new SlashCommandBuilder()
    .setName("leave-server")
    .setDescription("bot leave a server.")
    .addStringOption((option) =>
      option.setName("guildid").setDescription("guild id").setRequired(true)
    ),

  async execute(interaction, client) {

    try {
      const guildid = interaction.options.getString("guildid");

      const guild = client.guilds.cache.get(guildid);

      interaction.reply({
        content: `Luffy has left the server\n**${guild.name}** (${guild.id})`,
      });

      guild.leave().catch(() => {
        return false;
      });
    } catch (error) {
      return interaction.reply({ content: `Guild Not found`, ephemeral: true });
    }
  },
};
