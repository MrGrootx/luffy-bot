const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const autoroleSchema = require("../../schemas.js/autoroleSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Sets the autorole for the server")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("role add when users join your server")
        .addRoleOption((option) =>
          option.setName("role").setDescription("input role").setRequired(true)
        )
        
    
    )
    

    .addSubcommand((command) =>
      command.setName("disable").setDescription("disable autorole system")
    ),

  async execute(interaction) {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({ content: "You do not have permission to use this command", ephemeral: true })

    const sub = interaction.options.getSubcommand();
    const role = interaction.options.getRole("role");

    switch (sub) {
      case "setup":
        const Data = await autoroleSchema.findOne({
          GuildID: interaction.guild.id,
        });

        if (Data)
          return interaction.reply({
            content: `**Autorole is already setup for this server**\n  To disable do **/autorole disable**`,
            ephemeral: true,
          });

        if (!Data)
          await autoroleSchema.create({
            GuildID: interaction.guild.id,
            RoleID: role.id,
          });

        const embed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setTitle("Autorole added")
          .setDescription(
            ` ${role} will now be automatically assigned upon joining.`
          );

        interaction.reply({ embeds: [embed] });

        break;

      case "disable":
        const Data2 = await autoroleSchema.findOne({
            GuildID: interaction.guild.id,
        });

        if (!Data2)
          return interaction.reply({
            content: `**Autorole is not setup for this server**\n To setup do **/autorole setup**`,
            ephemeral: true,
          });

          if(Data2) await autoroleSchema.deleteMany({ GuildID: interaction.guild.id })

          const embed2 = new EmbedBuilder()
          .setColor('NotQuiteBlack')
          .setDescription('Autorole System has been disabled')
          
          await interaction.reply({ embeds: [embed2]})
    }
  },
};
