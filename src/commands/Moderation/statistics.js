const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("statistics")
    .setDescription("Replies with bot statistics!"),

  async execute(interaction, client) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(client.user.username + "'s statistics:")
          .addFields(
            { name: "Name", value: client.user.tag, inline: true },
            {
              name: "Identification",
              value: `\`${client.user.id}\``,
              inline: true,
            },
            {
              name: "Application commands",
              value: `${client.commands.size} commands`,
              inline: true,
            },
            {
              name: "Total guilds",
              value: `${client.guilds.cache.size} servers`,
              inline: true,
            },
            {
              name: "Author",
              value: `${
                require("../../../package.json").author || "Mr Groot#9862"
              }`,
              inline: true,
            },
            { name: "Language", value: "JavaScript", inline: true },
            {
              name: "Last version",
              value: `${require("../../../package.json").version}`,
              inline: true,
            },
            {
              name: "discord.js version",
              value: `${require("../../../package.json").dependencies[
                "discord.js"
              ].replace("^", "")}`,
              inline: true,
            },
            {
              name: "Node.JS version",
              value: `${process.version}`,
              inline: true,
            },
            {
              name: "Random-access memory",
              value: `${(os.totalmem() / 1024 / 1024)
                .toFixed()
                .substr(0, 2)}GB (${(
                process.memoryUsage().heapUsed /
                1024 /
                1024
              ).toFixed(2)}% used)`,
              inline: true,
            },
            {
              name: "Central processing unit",
              value: `${os.cpus().map((i) => `${i.model}`)[0]}`,
              inline: true,
            },
            { name: "Platform", value: `${os.platform}`, inline: true }
          )
          .setColor('NotQuiteBlack')
          .setThumbnail(client.user.displayAvatarURL({ size: 64}))
      ],
    });
  },
};
