const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const capSchema = require("../../schemas.js/captchaSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("captcha")
    .setDescription("Setup the captcha system for your server")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("setup the captcha varification system ")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription(
              "The role that will be given to the user when they pass the captcha"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("captcha")
            .setDescription("The captcha text you want in the image")
            .setRequired(true)
        )
    )

    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("disable the captcha varification system ")
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    )
      return await interaction.reply({
        content: `You dont have perms to setup and disable this system`,
      });

    const Data = await capSchema.findOne({ Guild: interaction.guild.id });

    const { options } = interaction;

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "setup":
        if (Data)
          return interaction.reply({
            content: `The captcha system is already setuped`,
          });
        else {
          const role = options.getRole("role");
          const captcha = options.getString("captcha");

          await capSchema.create({
            Guild: interaction.guild.id,
            Role: role.id,
            Captcha: captcha,
          });

          const embed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setDescription("The captcha system has been setup!");

          await interaction.reply({ embeds: [embed] });
        }
        break;

      case "disable":
        if (!Data)
          return interaction.reply({
            content: `The captcha system is not setup here`,
            ephemeral: true,
          });
        else {
          await capSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setDescription("The captcha system has been disabled!");

          await interaction.reply({ embeds: [embed] });
        }
    }
  },
};
