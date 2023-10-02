const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-role")
    .setDescription("Create a role")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the role")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("color")
      .setDescription("Color Of Role")
      .addChoices(
        {name: "aqua", value: "#00FFFF"},
        {name: "blurple", value: "#7289DA"},
        {name: "fuchsia", value: "#FF00FF"},
        {name: "gold", value: "#FFD700"},
        {name: "green", value: "#008000"},
        {name: "grey", value: "#808080"},
        {name: "greyple", value: "#7D7F9A"},
        {name: "light-grey", value: "#D3D3D3"},
        {name: "luminos-vivid-pink", value: "#FF007F"},
        {name: "navy", value: "#000080"},
        {name: "not-quite-black", value: "#232323"},
        {name: "orange", value: "#FFA500"},
        {name: "purple", value: "#800080"},
        {name: "red", value: "#FF0000"},
        {name: "white", value: "#FFFFFF"},
        {name: "yellow", value: "#FFFF00"},
        {name: "blue", value: "#0000FF"}
    )
      .setRequired(true)
    )

    .addNumberOption((option) =>
      option
        .setName("position")
        .setDescription("position of role")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("mention")
        .setDescription("Should The Role Be Mention By Everyone Or Not")
        .addChoices(
          { name: 'Yes', value: 'true' },
          { name: 'No', value: 'false' }
      )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction, client) {
    const name = interaction.options.getString("name");
    const position = interaction.options.getNumber("position");
    const mention = interaction.options.getString("mention");
    const color = interaction.options.getString("color");

    const CreateRoleembed = new EmbedBuilder()
      .setTitle("Create Role")
      .setDescription(
        `You Wanted To Create A Role Named ${name} With Color #${color}`
      )
      .setColor('NotQuiteBlack');

    const CreateRoleSuccessembed = new EmbedBuilder()
      .setTitle("Created Role")
      .setDescription(`You Created A Role Named ${name} With Color #${color}`)
      .setColor("Green");

    const buttons = new ActionRowBuilder().addComponents(
      // Yes And No Buttons
      new ButtonBuilder()
        .setLabel("Yes")
        .setCustomId("yes")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setLabel("No")
        .setCustomId("no")
        .setStyle(ButtonStyle.Secondary)
    );

    const message = await interaction.reply({
      embeds: [CreateRoleembed],
      components: [buttons],
      fetchReply: true,
    });

    // Button Collector
    const collector = message.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 40000, // 40 Seconds
    });

    collector.on("collect", async i => {
      const id = i.customId;
      const value = id;

      if (value === "yes") {
        await interaction.followUp({
          content: `Successfully Created A Role With Name **${name}**`,
        });
        interaction.guild.roles.create({
          // Create Role With Below Data
          name: name,
          color: color,
          position: position,
          mentionable: mention,
          permissions: [
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.ManageChannels,
          ],
        });
        collector.stop();
        i.update({
          embeds: [CreateRoleSuccessembed],
          components: [],
        });
      } else if (value === "no") {
        await interaction.followUp({ content: `**Role Creation Cancelled**`, ephemeral: true });
        collector.stop();
        i.update({
          embeds: [CreateRoleembed],
          components: [],
        });
      }
    });

    collector.on("end", async (collected) => {
      await interaction.editReply({
        embeds: [CreateRoleembed],
        components: [],
      });
      collector.stop();
    });
  },
};
