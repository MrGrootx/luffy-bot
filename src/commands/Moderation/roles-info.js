const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles-information")
    .setDescription("check your severs roles details")
    .addSubcommand((sub) =>
      sub
        .setName("check")
        .setDescription("info about role")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("the role you want check")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    )
      return interaction.reply({
        content: ":x: **Server manager only use this command**",
        ephemeral: true,
      });

    let rolescheck = interaction.options.getSubcommand();
    if (rolescheck == "check") {
      const role = interaction.options.getRole("role");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle(`Role info`)
            .setFields([
              {
                name: "``📝`` Role Name",
                value: role.name,
                inline: true,
              },
              {
                name: "``🆔`` Role ID",
                value: role.id,
                inline: true,
              },
              {
                name: "``🏔`` Role Color",
                value: role.hexColor,
                inline: true,
              },
              {
                name: "``🔗`` Role Mentionable",
                value: role.mentionable ? "Yes" : "No",
                inline: true,
              },
              {
                name: "``📇`` Role Hoist",
                value: role.hoist ? "Yes" : "No",
                inline: true,
              },
              {
                name: "``⌚`` Role Created Date&Time",
                value: `<t:${Math.floor(role.createdTimestamp / 1000)}:f>`,
                inline: true,
              },
              {
                name: "``⚙️`` Role Permissions",
                value:
                  role.permissions && role.permissions.toArray().length > 0
                    ? role.permissions.toArray().join(", ")
                    : "No Permission",
                inline: true,
              },
              {
                name: "``🎯`` Role Tag",
                value: role.tag ? role.tag.toArray().join(",") : "None",
                inline: true,
              },
              {
                name: " ",
                value: " ",
                inline: true,
              },
            ]),
        ],
      });
    }
  },
};

/**  
 *Coded By : Mr Groot#9862
*/