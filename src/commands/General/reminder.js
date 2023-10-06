const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const reminderSchema = require("../../schemas.js/remindSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("set a reminder something you want")
    .addSubcommand((option) =>
      option
        .setName("set")
        .setDescription("Set a reminder")
        .addStringOption((option) =>
          option
            .setName("reminder")
            .setDescription("The reminder you want to set")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("min")
            .setDescription("how many minutes from now ")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(59)
        )
        .addIntegerOption((option) =>
          option
            .setName("days")
            .setDescription("How many days from now")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(31)
        )
        .addIntegerOption((option) =>
          option
            .setName("hours")
            .setDescription("How many hours from now")
            .setRequired(false)
            .setMinValue(0)
            .setMinValue(23)
        )
    ),

  async execute(interaction) {
    const { options, guilds } = interaction;

    const reminder = options.getString("reminder");
    const min = options.getInteger("min") || "0";
    const hours = options.getInteger("hours") || "0";
    const days = options.getInteger("days") || "0";

    let time =
      Date.now() +
      days * 1000 * 60 * 60 * 24 +
      hours * 1000 * 60 * 60 +
      min * 1000 * 60;

    await reminderSchema.create({
      User: interaction.user.id,
      Time: time,
      Remind: reminder,
    });

    const embed = new EmbedBuilder()
      .setTitle("Reminder")
      .setColor("NotQuiteBlack")
      .setDescription(
        `Your reminder has been set <t:${Math.floor(
          time / 1000
        )}:R> i will remind you ${reminder}`
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
