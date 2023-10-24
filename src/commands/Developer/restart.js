const { SlashCommandBuilder } = require("discord.js");
const { exec } = require("child_process");
const ms = require("ms");
module.exports = {
  devOnly: true,
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("This Command Only For This Bot Developer"),
  async execute(interaction, client) {


 const owners = ["1153881675659477052"];
    if (!owners.includes(interaction.user.id)) return;
    var spawn = require("child_process").spawn;

    setTimeout(async () => {
      spawn(process.argv[0], process.argv.slice(1), {
        env: { process_restarting: 1 },
        stdio: "ignore",
        detached: true,
      }).unref();

      await interaction.reply({ content: "succesful restart" });
    }, ms("DURATION"));
    return;
  },
};
