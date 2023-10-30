const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("invite Luffy to your server"),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();

    interaction.reply({
      embeds: [
        embed
          .setColor("NotQuiteBlack")
          .setTitle("Invite Luffy to your server")
          .setDescription(
            "**Luffy** is a multipurpose Discord Bot, packed with many useful features."
          )
          .addFields(
            {
              name: "Invite Luffy",
              value:
                "[Click here](https://discord.com/api/oauth2/authorize?client_id=1035483725554353538&permissions=8&scope=bot%20applications.commands)",
              inline: true,
            },
            {
              name: `Support Server`,
              value: `[Click here](https://discord.gg/Nm5FSxK2gv)`,
              inline: true,
            }
          )
          .setThumbnail(client.user.displayAvatarURL({size:64}))
      ],
    });
  },
};
