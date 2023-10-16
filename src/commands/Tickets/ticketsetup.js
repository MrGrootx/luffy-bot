const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
} = require("discord.js");
const ticketSchema = require("../../schemas.js/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Ticket system setup")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Select a channel to  send the ticket panel")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription("Select a category to create the tickets")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to ping your staffs")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("ticket-logs")
        .setDescription("Select a channel to send ticket logs")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message of the ticket panel")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(999)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("set color for your ticket panel embed")
        .setRequired(true)
        .addChoices(
          { name: "Aqua", value: "#00FFFF" },
          { name: "Blurple", value: "#7289DA" },
          { name: "Fuchsia", value: "#FF00FF" },
          { name: "Gold", value: "#FFD700" },
          { name: "Green", value: "#008000" },
          { name: "Grey", value: "#808080" },
          { name: "Greyple", value: "#7D7F9A" },
          { name: "Light-grey", value: "#D3D3D3" },
          { name: "Luminos-vivid-pink", value: "#FF007F" },
          { name: "Navy", value: "#000080" },
          { name: "Not-quite-black", value: "#232323" },
          { name: "Orange", value: "#FFA500" },
          { name: "Purple", value: "#800080" },
          { name: "Red", value: "#FF0000" },
          { name: "White", value: "#FFFFFF" },
          { name: "Yellow", value: "#FFFF00" },
          { name: "Blue", value: "#0000FF" }
        )
    ),

  async execute(interaction, client) {
    try {
      const { options, guild } = interaction;
      const channelid = options.getChannel("channel");
      const category = options.getChannel("category");
      const role = options.getRole("role");
      const ticketLogs = options.getChannel("ticket-logs");
      const message = options.getString("message");
      const color = options.getString("color");

      const GuildID = interaction.guild.id;

      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return interaction.reply({
          content: "You don't have permission to use this command",
          ephemeral: true,
        });

      const data = await ticketSchema.findOne({ GuildID: GuildID });
      if (data)
        return interaction.reply({
          content: `You already have a ticket panel setup
          **To disable the panel, use the \`/ticket-disable\` command**`,
          ephemeral: true,
        });
      else {
        await ticketSchema.create({
          GuildID: GuildID,
          Channel: channelid.id,
          Category: category.id,
          Role: role.id,
          Logs: ticketLogs.id,
        });

        const embed = new EmbedBuilder()
          .setColor(color)
          .setTimestamp()
          .setTitle("Ticket Panel")
          .setDescription(message);

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("create-ticket")
            .setLabel("Create")
            .setStyle(ButtonStyle.Secondary),
        );

        const channel = client.channels.cache.get(channelid.id);
        await channel.send({ embeds: [embed], components: [button] });

        await interaction.reply({
          content: `**The Ticket panel  has been sent to ${channel}**`,
          ephemeral: true,
        });
      } 
    } catch (error) {
        console.log(error)
    }
  },
};
