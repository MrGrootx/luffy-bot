const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const warningSchema = require("../../schemas.js/warning");
const reminderSchema = require("../../schemas.js/remindSchema");
const ecnomySchema = require("../../schemas.js/Eco-Account");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletedata")
    .setDescription("delete all your restored data"),

  async execute(interaction, client) {
    const { user } = interaction;

    const embed = new EmbedBuilder()
      .setDescription(`All your data will be permanently deleted, and you won't be able to reinstate it. Are you sure you want to proceed?`)
      .setColor("NotQuiteBlack")

    const embed2 = new EmbedBuilder()
      .setDescription(`${user} Your All Data Has Been Deleted`)
      .setColor("NotQuiteBlack")

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("SURE")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("yes")
    );

    const msg = await interaction.reply({
      embeds: [embed],
      ephemeral: true,
      components: [row],
    });
    const collector = msg.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      const { user } = i;
      if (i.customId === "yes") {
        await warningSchema.deleteMany({ UserID: user.id });
        await reminderSchema.deleteMany({ User: user.id });
        await ecnomySchema.deleteMany({ User: user.id });

        await i.update({ embeds: [embed2], components: [], ephemeral: true });

        console.log(`${user.username} deleted all his data!`);
      }
    });
  },
};
