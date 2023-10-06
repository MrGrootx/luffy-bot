const { Integration } = require("discord.js");

// ContextMenuCommandBuilder

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (!interaction.guild) return;

    if (interaction.customId !== "Moderate") return;
    else {
      const String = await interaction.values.toString();

      if (String.includes("ban")) {
        // const userid = await interaction.values[0].replace(/ban/g, '');
        const userid = await interaction.values[0].replace(/ban/g, "");

        const reason = `Moderated by ${interaction.user}`;
        const ban = await interaction.guild.members
          .ban(userid, { reason })
          .catch(async (err) => {
            await interaction.reply({
              content: `I can't ban that user`,
              ephemeral: true,
            })
            return
          });
        if (!ban)
          return interaction.reply({
            content: ` I Can't Ban This User Maybe The User is Already BANNED From This this server `,
            ephemeral: true,
          });

        if (ban)
          return interaction.reply({
            content: ` I Have Banned ${userid}`,
            ephemeral: true,
          });
      }

      if (String.includes("kick")) {
        const userid = await interaction.values[0].replace(/kick/g, "");
        const member = await interaction.guild.members.fetch(userid);
        const kick = await member
          .kick({ reason: `Moderated by ${interaction.user}!` })
          .catch(async (err) => {
            await interaction.reply({
              content: `I can't kick that user`,
              ephemeral: true,
            });
          });
        if (!member)
          return interaction.reply({
            content: ` I Can't find this User Maybe The User is Already kicked From This this server `,
            ephemeral: true,
          });

        if (kick)
          return interaction.reply({
            content: ` I Have kicked ${userid}`,
            ephemeral: true,
          }).catch( (err) => {
            return;
          })
      }
    }
  },
};
