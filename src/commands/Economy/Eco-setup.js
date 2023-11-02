const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const economySetup = require("../../schemas.js/Eco-Setup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("economy-setup")
    .setDescription("economy system Enabled/Disable")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("setup")
        .setDescription("Enable/Disable")
        .setRequired(true)
        .addChoices(
          { name: "Enable", value: "enable" },
          { name: "Disable", value: "disable" }
        )
    ),

  async execute(interaction) {
    const str = interaction.options.getString("setup");
    const guildId = interaction.guild.id;
    let enableEconomy = false;

    if (str === "enable") {
      enableEconomy = true;
    }

    let Data = await economySetup.findOne({ GuildID: guildId });

    if (!Data) {
      // Create a new document if it doesn't exist
      Data = new economySetup({
        GuildID: guildId,
        DisEn: enableEconomy,
      });
      Data.save();
    } else {
      // Update the existing document
      Data.DisEn = enableEconomy;
      Data.save();
    }
    interaction.reply({
    //   content: `Economy System ${enableEconomy ? "enabled" : "disabled"}`,
      embeds: [
        new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setTitle(`${enableEconomy ? "Enabled" : "Disabled"} Economy System`)
      ]
    });
  },
};
