const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-role")
    .setDescription("Add a role to user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add a role")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("the role want to add")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = await interaction.guild.members.cache.get(user.id);

    if (member.roles.cache.has(role.id)) {
      const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setDescription(`User ${user} already has the role \`${role.name}\``)
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
      await interaction.guild.members.cache.get(user.id).roles.add(role);
      const embed = new EmbedBuilder()
        .setColor(role.color)
        .setDescription(
          `succesfully added role **${role.name}** to **${user.tag}**`
        )
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ size: 64 }),
        })
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
          `Failed to add role \`${role.name}\` to \`${user.tag}\` user \``
        );
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
