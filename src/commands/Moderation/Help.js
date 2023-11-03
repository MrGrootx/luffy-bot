const {
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get information about the bot")
    .setDMPermission(false),
  async execute(interaction, client) {
    if (!interaction || !interaction.guild) {
      return;
    }

    const emoji = {
      admin: "1162250996148359168",
      moderation: "1107688449928089670",
      general: "1162251059541065818",
      premiumcommands: "1162251810006908948",
      fun: "1162251111583981578",
      nsfw: "1162251739920080946",
      others: "1162253507924074517",
      tickets: "1167707287469690880",
      economy: "1169631902920089731",
    };

    const directories = [
      ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
    ];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const allowedFolders = [
      "General",
      "Moderation",
      "Admin",
      "PremiumCommands",
      "Fun",
      "NSFW",
      "Others",
      "Tickets",
      "Economy",
    ];

    const categores = directories
      .filter((dir) => allowedFolders.includes(dir))
      .map((dir) => {
        const getCommands = interaction.client.commands
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
      .setColor("NotQuiteBlack")
      .setDescription(
        `:wave: Welcome to Luffy's help menu. Use the menu below to 
      navigate to the menu of your choice. In Case of **functional trouble**, 
      Join our [Support Server](https://discord.gg/Nm5FSxK2gv)`
      )
      .setAuthor({
        name: "Luffy Help Menu",
        iconURL: client.user.displayAvatarURL(),
      })
      .setImage(
        "https://media.discordapp.net/attachments/1165269900944756776/1167702827670442004/banner2.0.png?ex=654f1700&is=653ca200&hm=9d7743d90b805e7c448de1a29b471c28da2e91ba52093cd5052c60e8a95b9be5&="
      );

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("select a category")
          .setDisabled(state)
          .addOptions(
            categores.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Command list for ${cmd.directory} `,
                emoji: emoji[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];
    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      ComponentType: ComponentType.StringSelectMenuBuilder,
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categores.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${formatString(directory)}`)
        .setDescription(
          `A list of all the commands categorized under ${directory}`
        )
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`/${cmd.name}\``,
              value: cmd.description,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] }).catch((err) => {
        return;
      });
    });

    collector.on("end", () => {
      initialMessage.update({ components: components(true) }).catch((err) => {
        return;
      });
    });
  },
};

// this lines added in handleCommands
// const properties = { folder, ...command };
// client.commands.set(command.data.name, properties);
