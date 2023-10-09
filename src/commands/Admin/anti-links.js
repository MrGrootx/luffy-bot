const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const linkSchema = require("../../schemas.js/anti-link");

module.exports = {
  /**
   *
   *@param {import('discord.js').Client} client
   */

  data: new SlashCommandBuilder()
    .setName("antilink-setup")
    .setDescription("Sets up anti-link system.")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("setup antilinks system")
        .addStringOption((option) =>
          option
            .setName("permission")
            .setDescription("who can bypass the links")
            .setRequired(true)
            .addChoices(
              { name: "Adminstrator", value: "Administrator" },
              { name: "ManageChannels", value: "ManageChannels" },
              { name: "Manage Guild", value: "ManageGuild" },
              { name: "Embed Links", value: "EmbedLinks" },
              { name: "Attach Files", value: "AttachFiles" },
              { name: "Manage Messages", value: "ManageMessages" }
            )
        )
    )

    .addSubcommand((command) =>
      command.setName("disable").setDescription("disable antilinks system")
    )
    .addSubcommand((command) =>
      command.setName("check").setDescription("check status of anti-links")
    )
    .addSubcommand((command) =>
      command
        .setName("edit")
        .setDescription("Edit your status of the anti link system")
        .addStringOption((option) =>
          option
            .setName("permission")
            .setDescription("who can bypass the links")
            .setRequired(true)
            .addChoices(
              { name: "Adminstrator", value: "Administrator" },
              { name: "ManageChannels", value: "ManageChannels" },
              { name: "Manage Guild", value: "ManageGuild" },
              { name: "Embed Links", value: "EmbedLinks" },
              { name: "Attach Files", value: "AttachFiles" },
              { name: "Manage Messages", value: "ManageMessages" }
            )
        )
    ),
  async execute(interaction) {
    const { options } = interaction;

    // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true })
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });

    const sub = options.getSubcommand();

    switch (sub) {
      case "setup":
        const permissions = options.getString("permission");
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });

        if (Data)
          return await interaction.reply({
            content: `**antilink system is already setup**\nTo disable\n> **antilink-setup-disable**`,
            ephemeral: true,
          });

        if (!Data) {
          linkSchema.create({
            Guild: interaction.guild.id,
            Perms: permissions,
          });
        }

        const embed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setDescription(
            `successfully setup anti-links with permissions **${permissions}**`
          );

        await interaction.reply({ embeds: [embed] });

        break;
    }

    switch (sub) {
      case "disable":
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });

        if (!Data)
          return await interaction.reply({
            content: "**already disabled** \nTo enable \n> **/antilink-setup**",
            ephemeral: true,
          });

        await linkSchema.deleteMany();
        await interaction.reply({
          content: "successfully **disabled anti-links system**",
          ephemeral: true,
        });
    }

    switch (sub) {
      case "check":
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });

        if (!Data)
          return await interaction.reply({
            content: "**no data found** \nTo enable \n> **/antilink-setup**",
            ephemeral: true,
          });

        const permissions = Data.Perms;

        if (!permissions)
          return await interaction.reply({
            content: "You have perms to do that",
            ephemeral: true,
          });
        else
          await interaction.reply({
            content: `Your anti link system is currently setup with permissions ${permissions}`,
            ephemeral: true,
          });
    }

    switch (sub) {
      case "edit":
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });
        const permissions = options.getString("permission");


        if (!Data)
          return await interaction.reply({
            content: `There is no anti link system setup here`,
            ephemeral: true,
          });
          else {
            await linkSchema.deleteMany();

            await linkSchema.create({ 
                Guild: interaction.guild.id,
                Perms: permissions
            })

            const embed = new EmbedBuilder()
            .setColor('NotQuiteBlack')
            .setDescription(`successfully edited anti-links system with permissions ${permissions}`)

            await interaction.reply({ embeds: [embed] })
          }

        break;
    }
  },
};
