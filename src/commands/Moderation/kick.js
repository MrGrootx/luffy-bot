const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kicks the member")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you 'like to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for kicking the member")
    ),
  async execute(interaction) {
    // who can access this command
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    )
      return await interaction.reply({
        content: `To use this command you need to have **Kick Members** permission`,
        ephemeral: true,
      });

    const user = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const member = await interaction.guild.members.fetch(user.id).catch(() => {
      return;
    });

    if (!reason) reason = "No reason provided";

    if (!member)
      return await interaction
        .reply({ content: `User Not Found`, ephemeral: true })
        .catch(console.error);

    // kick youself
    if ((member, member.id == interaction.user.id)) {
      return await interaction.reply({
        content: "You can't kick yourself!",
        ephemeral: true,
      });
    }

    // server owner
    if ((member, member.id == interaction.guild.ownerId)) {
      return await interaction.reply({
        content: "You can't kick the server owner!",
        ephemeral: true,
      });
    }
    // ban higher command
    if (member) {
      if (
        member.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        return await interaction.reply({
          content: `You cannot ban because they have a higher/same role!`,
          ephemeral: true,
        });
      }
    }

    // send log
    const logsend = process.env.KICK_LOG;
    const logchannelsend = interaction.guild.channels.cache.get(logsend);

    const logembed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setDescription(
        ` Action By : ${interaction.user} 
    \nAction On : ${user} \n
    Reason : ${reason} \n
    Time : ${interaction.createdAt.toTimeString()} \n
    Date : ${interaction.createdAt.toDateString()}`
      )
      .setThumbnail(user.displayAvatarURL())
      .setFooter({ text: "KICKED LOG" });

    await logchannelsend.send({ embeds: [logembed] });

    if (!logchannelsend) return console.log("No Log Channel Found");

    await member.kick(reason).catch(console.error);

    // reply interaction
    const replyembed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setDescription(`<@${user.id}> has been kicked`);

    await interaction
      .reply({ embeds: [replyembed], ephemeral: true })
      .catch(() => {
        return;
      });
  },
};

/**
 *Coded By : Mr Groot#9862
 */
