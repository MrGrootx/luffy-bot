const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user")
    .addUserOption((option) =>
      option.setName("target").setDescription("The user")
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("target") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    /// Activity lines

    const statusconfig = {
      "": "None",
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      streaming: "Streaming",
      offline: "Offline",
    };

    const statusinfo = member.presence
      ? statusconfig[member.presence.status]
      : "Offline";

    // Activity end

    // const userroles = member.roles.cache.map(role => role.name.toString()).join(',')
    const userroles = member.roles.cache
      .filter((role) => role.name !== "everyone")
      .map((role) => (role.name === "@everyone" ? "everyone" : role.name))
      .join(",");

    const userEmbed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setAuthor({
        name: "User information",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(`@${user.username}`.toLowerCase())
      .setThumbnail(user.displayAvatarURL({ size: 64 }))

      .addFields(
        {
          name: "``📄`` Display Name",
          value: `${user.username}<@${user.id}>`,
          inline: true,
        },
        {
          name: "``🆔`` ID",
          value: user.id,
          inline: true,
        },
        {
          name: "``📅`` Joined",
          value: user.createdAt.toLocaleDateString(),
          inline: true,
        },
        {
          name: "``📅`` Discord Created",
          value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "``🚀`` Server Boost",
          value: `${user.premiumSince ? "Yes" : "No"}`,
          inline: true,
        },
        {
          name: "``📛`` Nickname",
          value: `${member.nickname ? `${member.nickname}` : "None"}`,
          inline: true,
        },
        {
          name: "``🧾``Account Type",
          value: `${user.bot ? "Bot" : "Human"}`,
          inline: true,
        },

        {
          name: "``🗳`` Roles Count",
          value: `${member.roles.cache.size - 1}`,
          inline: true,
        },
        {
          name: "``⚙`` Highest Role",
          value: `${member.roles.highest}`,
          inline: true,
        },
        {
          name: "``🎙`` Voice Channel",
          value: `${
            member.voice.channel ? `${member.voice.channel.name}` : "None"
          }`,
          inline: true,
        },
        {
          name: "``⏰`` Timezone",
          value: `UTC ${new Date().getTimezoneOffset() / 60}`,
          inline: true,
        },
        {
          name: "``📶``Status",
          value: statusinfo,
          inline: true,
        }
      )
      .addFields(
        {
          name: "``🛅`` **Key Permissions** ",
          value: `${member.permissions.toArray().join(", ")}`,
        },

        {
          name: "``🧩``User Roles Information",
          value: `**${userroles}**`,
          // ${member.roles.cache.map(role => role.toString()).join(', ')}
        }
      );

    interaction.reply({ embeds: [userEmbed] });
  },
};

/**
 *Coded By : Mr Groot#9862
 */
