const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-role")
    .setDescription("remove a role to user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove a role")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("the role want to remove")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = await interaction.guild.members.cache.get(user.id);

    if (!member.roles.cache.has(role.id)) {
      const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setDescription(`User ${user} doesn't have the role \`${role.name}\``)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ size: 64 }),
        })
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.guild.members.cache.get(user.id).roles.remove(role);
      const embed = new EmbedBuilder()
        .setColor(role.color)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ size: 64 }),
        })
        .setDescription(
          `succesfully removed **${role.name}** role from **${user.tag}**`
        )
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ size: 64 }),
        })

        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setTimestamp()
        .setDescription(
          `Failed to remove role \`${role.name}\` from user \`${user.tag}\`  \``
        );
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
