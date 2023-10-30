const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-role-everyone")
    .setDescription("remove a role to everyone")
    .addRoleOption((option) =>
      option.setName("role").setDescription("role to remove").setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const members = await interaction.guild.members.fetch();

    const bot = interaction.guild.members.cache.get(interaction.client.user.id);

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content:
          "You don't have **Administrator** permission to use this command",
        ephemeral: true,
      });
    else {
        if (bot.roles.highest.comparePositionTo(role) <= 0) {
            return await interaction.reply({
              content: "I can't manage roles which are equals or above me",
            });
          }

      const givingembed = new EmbedBuilder();

      await interaction.reply({
        embeds: [
          givingembed
            .setColor("NotQuiteBlack")
            .setDescription(`Removing${role} role... this may take some time`),
        ],
      });

      let num = 0;
      setTimeout(() => {

        

        members.forEach(async (m) => {
          m.roles.remove(role).catch((err) => {
            return;
          });

          if (bot.roles.highest.comparePositionTo(role) > 0) {
            m.roles.remove(role).catch((err) => {
              return;
            });
          }

          num++;

          const embed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setDescription(`${num} Removed ${role} role...`);

          await interaction.editReply({ content: ``, embeds: [embed] });
        });

        const finembed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Completed")
          .setFields(
            { name: "Role", value: `${role}`, inline: true },
            {
              name: "Role Removed By",
              value: `${interaction.user}`,
              inline: true,
            },
            { name: "Guild", value: `${interaction.guild}`, inline: true },
            {
              name: "Total Members Removed Role",
              value: `${num}`,
              inline: true,
            }
          )
          .setTimestamp();

        interaction.editReply({ embeds: [finembed] });
      }, 1000);
    }
  },
};
