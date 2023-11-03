const {
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help-rebuild")
    .setDescription("Rebuilds the help command")
    .setDMPermission(false),

  async execute(interaction) {
    const { client, channel, value } = interaction;

    const emojis = {
      information: "🚗",
    };

    

    function getCommand(name) {
      const getCommandID = client.application.commands.cache
        .filter((cmd) => cmd.name === name)
        .map((cmd) => cmd.id);

      return getCommandID;
    }

    const dir = [...new Set(client.commands.map((cmd) => cmd.folder))];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categorys = dir.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description: cmd.data.description || "No Description",
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder()
      .setDescription("See list of commands")
      .setColor("Random")
      .setAuthor({
        name: `${client.user.username}'s Commands`,
        iconURL: client.user.displayAvatarURL(),
      });

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Nothing selected")
          .setDisabled(state)
          .addOptions(
            categorys.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands from ${cmd.directory} category`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const inteialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = channel.createMessageComponentCollector({
      filter,
      ComponentType: ComponentType.StringSelect,
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categorys.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categotyEmbed = new EmbedBuilder()
        .setTitle(
          `${emojis[directory.toLowerCase()] || null} ${formatString(
            directory
          )} commands`
        )
        .setDescription(`A list all the commands categorized uder ${directory}`)
        .setColor("Random")
        .addFields(
            category.commands.map((cmd) => {
            return {
              name: `</${cmd.name}:${getCommand(cmd.name)}>`,
              value: `\`${cmd.description}\``,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categotyEmbed] });
    });

    collector.on("end", () => {
      inteialMessage.edit({ components: components(true) });
    });
  },
};
