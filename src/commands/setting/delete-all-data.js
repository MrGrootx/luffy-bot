const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
// const login = require("../../Schemas.js/loginSchemaMail");
// const join = require("../../Schemas.js/Join to create/jointocreatechannels");
// const hug = require("../../Schemas.js/Interaction Schemas/hug");
// const kiss = require("../../Schemas.js/Interaction Schemas/kiss");
// const slap = require("../../Schemas.js/Interaction Schemas/slap");
// const eco = require("../../Schemas.js/ecoSchema");
// const level = require("../../Schemas.js/Leveling/level");
// const remind = require("../../Schemas.js/remindSchema");
// const test = require("../../Schemas.js/test");
const warningSchema = require("../../schemas.js/warning");
const reminderSchema = require("../../schemas.js/remindSchema");

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
        // await login.deleteMany({ User: user.id});
        // await join.deleteMany({ User: user.id});
        // await hug.deleteMany({ User: user.id});
        // await kiss.deleteMany({ User: user.id});
        // await slap.deleteMany({ User: user.id});
        // await eco.deleteMany({ User: user.id});
        // await level.deleteMany({ User: user.id});
        // await remind.deleteMany({ User: user.id});
        // await test.deleteMany({ UserID: user.id});
        await warningSchema.deleteMany({ UserID: user.id });
        await reminderSchema.deleteMany({ User: user.id });

        await i.update({ embeds: [embed2], components: [], ephemeral: true });

        console.log(`${user.username} deleted all his data!`);
      }
    });
  },
};
