const {
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ApplicationCommandType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Moderate")
    .setType(ApplicationCommandType.User),

  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    )
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });

      const user = await interaction.guild.members.fetch(interaction.targetId);

      const menu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('Moderate')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder('Nothing Selected')
        .addOptions(
            {
                label: 'Ban',
                description: 'Ban the member',
                value: `ban ${interaction.targetId}`
            },
            {
                label: 'Kick',
                description: 'Kick the member',
                value: `kick ${interaction.targetId}`
            }
            
        )
      );

      const embed = new EmbedBuilder()
      .setColor('NotQuiteBlack')
      .setDescription(`Moderate ${user} Below!`)

      await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true})
  },
};
