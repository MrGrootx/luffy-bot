const { EmbedBuilder, Events } = require("discord.js");

function logging(client) {
  const logSchema = require("../schemas.js/logSchema");

  function send_log(guildId, embed) {
    logSchema.findOne({ Guild: guildId }, async (err, data) => {
      if (!data || !data.Channel) return;
      const LogChannel = client.channels.cache.get(data.Channel);

      if (!LogChannel) return;
      embed.setTimestamp();

      try {
        LogChannel.send({ embeds: [embed] });
      } catch (err) {
        console.log("Error sending log!");
      }
    });
  }

  client.on("messageDelete", function (message) {
    try {
      if (message.guild === null) return;
      if (message.author.bot) return;

      const embed = new EmbedBuilder()
        .setTitle("Message Deleted")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({
          name: `Author`,
          value: `<@${message.author.id}> - *${message.author.tag}*`,
        })
        .addFields({ name: `Channel`, value: `${message.channel}` })
        .addFields({ name: `Deleted Message`, value: `${message.content}` })

        .setFooter({ text: `Message Deleted`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(message.guild.id, embed);
    } catch (err) {
      console.log(`Couldn't log deleted msg`);
    }
  });

  // Channel Topic Updating
  client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
    try {
      if (channel.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Topic Changed")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Channel`, value: `${channel}` })
        .addFields({ name: `Old Topic`, value: `${oldTopic}` })
        .addFields({ name: `New Topic`, value: `${newTopic}` })

        .setFooter({ text: `Topic Update`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(channel.guild.id, embed);
    } catch (err) {
      console.log("Err logging topic update");
    }
  });

  // Channel Permission Updating
  client.on(
    "guildChannelPermissionsUpdate",
    (channel, oldPermissions, newPermissions) => {
      try {
        if (channel.guild === null) return;

        const embed = new EmbedBuilder()
          .setTitle("Channel Updated")
          .setColor("NotQuiteBlack")
          .setTimestamp()
          .addFields({ name: `Channel`, value: `${channel}` })
          .addFields({
            name: `Changes`,
            value: `Channel's permissions/name were updated`,
          })

          .setFooter({ text: `Permissions Update`,iconURL: `${client.user.displayAvatarURL()}` });

        return send_log(channel.guild.id, embed);
      } catch (err) {
        console.log("Err logging channel update");
      }
    }
  );

  // unhandled Guild Channel Update
  client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
    try {
      if (oldChannel.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Channel Updated")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Channel`, value: `${oldChannel}` })
        .addFields({
          name: `Changes`,
          value: `**Luffy** couldn't find any changes!`,
        })

        .setFooter({ text: `Channel Update` ,iconURL: `${client.user.displayAvatarURL()}`});

      return send_log(oldChannel.guild.id, embed);
    } catch (err) {
      console.log("Err logging unhandled channel update");
    }
  });

  // Member Started Boosting
  client.on("guildMemberBoost", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${member.user.username} started Boosting`)
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Server`, value: `${member.guild.name}` })

        .setFooter({ text: `Boosting Started`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Err logging member boost start");
    }
  });

  // Member Unboosted
  client.on("guildMemberUnboost", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${member.user.username} stopped Boosting`)
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Server`, value: `${member.guild.name}` })

        .setFooter({ text: `Boosting Stopped`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Err logging member boost stop");
    }
  });

  // Member Got Role
  client.on("guildMemberRoleAdd", (member, role) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${member.user.username} was given a Role`)
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Role`, value: `${role}` })

        .setFooter({ text: `Role Given`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Err logging role give");
    }
  });

  // Member Lost Role
  client.on("guildMemberRoleRemove", (member, role) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${member.user.username} lost a Role`)
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Role`, value: `${role}` })

        .setFooter({ text: `Role Removed`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Err logging role remove");
    }
  });

  // Nickname Changed
  client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle("Nickname Updated")
        .setColor("NotQuiteBlack")
        .setTimestamp()

        .setFooter({ text: `Nickname Changed`,iconURL: `${client.user.displayAvatarURL()}` })
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({
          name: `Old Nickname`,
          value: `${oldNickname || "**None**"}`,
        })
        .addFields({
          name: `New Nickname`,
          value: `${newNickname || "**None**"}`,
        });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Err logging nick update");
    }
  });

  // Member Joined
  client.on("guildMemberAdd", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("User Joined")
        .setColor("NotQuiteBlack")
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Member ID`, value: `${member.user.id}` })
        .addFields({ name: `Member Tag`, value: `${member.user.tag}` })
        .setTimestamp()

        .setFooter({ text: `User Joined` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Err logging member add");
    }
  });

  // Member Left
  client.on("guildMemberRemove", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("User Left")
        .setColor("NotQuiteBlack")
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Member ID`, value: `${member.user.id}` })
        .addFields({ name: `Member Tag`, value: `${member.user.tag}` })
        .setTimestamp()

        .setFooter({ text: `User Left` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Err logging member leave");
    }
  });

  // Server Boost Level Up
  client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${guild.name} advanced a Boosting Level`)
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({
          name: `Info`,
          value: `**${guild.name}** advanced from level **${oldLevel}** to **${newLevel}**!`,
        })
        .addFields({ name: `Server`, value: `${member.guild.name}` })

        .setFooter({ text: `Boosting Level Up`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging boost level up");
    }
  });

  // Server Boost Level Down
  client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${guild.name} lost a Boosting Level`)
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({
          name: `Info`,
          value: `**${guild.name}** lost a level, from **${oldLevel}** to **${newLevel}**!`,
        })
        .addFields({ name: `Server`, value: `${member.guild.name}` })

        .setFooter({ text: `Boosting Level Down`,iconURL: `${client.user.displayAvatarURL()}` });
      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging level down");
    }
  });

  // Banner Added
  client.on("guildBannerAdd", (guild, bannerURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}'s Banner was Updated`)
        .setColor("NotQuiteBlack")
        .addFields({ name: `Banner URL`, value: `${bannerURL}` })
        .setImage(bannerURL)

        .setFooter({ text: `Banner Updated` ,iconURL: `${client.user.displayAvatarURL()}`})
        .setTimestamp();

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging banner change");
    }
  });

  // AFK Channel Added
  client.on("guildAfkChannelAdd", (guild, afkChannel) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("AFK channel Added")
        .setColor("NotQuiteBlack")
        .addFields({ name: `AFK Channel`, value: `${afkChannel}` })
        .setTimestamp()

        .setFooter({ text: `AFK Channel Added`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging afk channel add");
    }
  });

  // Guild Vanity Add
  client.on("guildVanityURLAdd", (guild, vanityURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Vanity URL Added")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Vanity URL`, value: `${vanityURL}` })

        .setFooter({ text: `Vanity Created`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging vanity add");
    }
  });

  // Guild Vanity Remove
  client.on("guildVanityURLRemove", (guild, vanityURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Vanity URL Removed")
        .setColor("NotQuiteBlack")
        .addFields({ name: `Old Vanity`, value: `${vanityURL}` })
        .setTimestamp()

        .setFooter({ text: `Vanity Removed` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging vanity remove");
    }
  });

  // Guild Vanity Link Updated
  client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Vanity URL Updated")
        .setColor("NotQuiteBlack")
        .addFields({ name: `Old Vanity`, value: `${oldVanityURL}` })
        .addFields({ name: `New Vanity`, value: `${newVanityURL}` })
        .setTimestamp()

        .setFooter({ text: `Vanity Updated`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging vanity update");
    }
  });

  // Message Pinned
  client.on("messagePinned", (message) => {
    try {
      if (message.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Message Pinned")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Pinner`, value: `${message.author}` })
        .addFields({ name: `Message`, value: `${message.content}` })

        .setFooter({ text: `Message Pinned`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(message.guild.id, embed);
    } catch (err) {
      console.log("Err logging pin add");
    }
  });

  // Message Edited
  client.on("messageContentEdited", (message, oldContent, newContent) => {
    try {
      if (message.guild === null) return;
      if (message.author.bot) return;

      const embed = new EmbedBuilder()
        .setTitle("Message Edited")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Member`, value: `${message.author}` })
        .addFields({ name: `Old Message`, value: `${oldContent}` })
        .addFields({ name: `New Message`, value: `${newContent}` })

        .setFooter({ text: `Message Edited` });

      return send_log(message.guild.id, embed);
    } catch (err) {
      console.log("Err logging message edit");
    }
  });

  // Role Position Updated
  client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
    try {
      if (role.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Role position Updated")
        .setColor("NotQuiteBlack")
        .addFields({ name: `Role`, value: `${role}` })
        .addFields({ name: `Old Position`, value: `${oldPosition}` })
        .addFields({ name: `New Position`, value: `${newPosition}` })
        .setTimestamp()

        .setFooter({ text: `Role Position Updated`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Err logging role pos update");
    }
  });

  // Role Permission Updated
  client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
    try {
      if (role.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Role permissions Updated")
        .setColor("NotQuiteBlack")
        .addFields({ name: `Role`, value: `${role}` })
        .addFields({ name: `Old Permissions`, value: `${oldPermissions}` })
        .addFields({ name: `New Permissions`, value: `${newPermissions}` })
        .setTimestamp()

        .setFooter({ text: `Role Permissions Updated`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Err logging role perms update");
    }
  });

  // VC Switch
  client.on("voiceStateUpdate", (oldState, newState) => {
    try {
      const member = newState.member;

      if (!member.guild) return;

      const newUserChannel = newState.channel;
      const oldUserChannel = oldState.channel;
      const username = newState.member.user.tag;
      const user = newState.member.id;

      if (oldUserChannel === null && newUserChannel !== null) {
        // User Joined
        const embed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setTimestamp()
          .setDescription(
            `<@${user}> **joined voice channel** ${newUserChannel}`
          )

          .setAuthor({
            name: `${username}`,
            iconURL: `${member.user.displayAvatarURL({ size: 64 })}`,
          })
          .setFooter({
            text: `${client.user.username}`,
            iconURL: `${client.user.displayAvatarURL()}`,
          });

        return send_log(member.guild.id, embed);
      } else if (oldUserChannel !== null && newUserChannel === null) {
        const embed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setTimestamp()
          .setDescription(`<@${user}> **left voice channel** ${oldUserChannel}`)
          .setAuthor({
            name: `${username}`,
            iconURL: `${member.user.displayAvatarURL({ size: 64 })}`,
          })
          .setFooter({
            text: `${client.user.username}`,
            iconURL: `${client.user.displayAvatarURL()}`,
          });
        return send_log(member.guild.id, embed);
      }

      if (oldUserChannel === newUserChannel) return;

      if (oldUserChannel) {
        const embed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setTimestamp()
          .setDescription(
            `<@${user}> **moved voice channel** ${newUserChannel}`
          )
          .setAuthor({
            name: `${username}`,
            iconURL: `${member.user.displayAvatarURL({ size: 64 })}`,
          })
          .setFooter({
            text: `${client.user.username}`,
            iconURL: `${client.user.displayAvatarURL()}`,
          });

        return send_log(member.guild.id, embed);
      }
    } catch (err) {
      console.log("Err logging vc switch");
      console.error(err);
    }
  });

  // Role Created
  client.on("roleCreate", (role) => {
    try {
      if (role.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Role Created")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Role Name`, value: `${role.name}` })
        .addFields({ name: `Role ID`, value: `${role.id}` })
        .addFields({ name: `Role HEX`, value: `${role.hexColor}` })
        .addFields({ name: `Role Pos`, value: `${role.position}` })

        .setFooter({ text: `Role Created`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Err logging role create");
    }
  });

  // Role Deleted
  client.on("roleDelete", (role) => {
    try {
      if (role.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Role Deleted")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Role Name`, value: `${role.name}` })

        .setFooter({ text: `Role Deleted`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Err logging role delete");
    }
  });

  // User Banned
  client.on("guildBanAdd", ({ guild, user }) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("User Banned")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Member`, value: `${user}` })
        .addFields({ name: `Member ID`, value: `${user.id}` })
        .addFields({ name: `Member Tag`, value: `${user.tag}` })

        .setFooter({ text: `User Banned`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging ban add");
    }
  });

  // User Unbanned
  client.on("guildBanRemove", ({ guild, user }) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("User Unbanned")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Member`, value: `${user}`,iconURL: `${client.user.displayAvatarURL()}` })

        .setFooter({ text: `User Unbanned` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Err logging ban remove");
    }
  });

  // Channel Created
  
  client.on("channelCreate", (channel) => {
 
    try {

    if (channel.guild === null) return;
    
    const embed = new EmbedBuilder()
        .setTitle('Channel Created')
        .setColor('NotQuiteBlack')
        .setTimestamp()
        .addFields({ name: `Channel`, value: `${channel}`})
        .setFooter({ text: `Channel Created`,iconURL: `${client.user.displayAvatarURL()}`})

    return send_log(channel.guild.id, embed);

} catch (err) {
    console.log('Err logging channel create')
    console.error(err)
}

});

  // Channel Deleted
  client.on("channelDelete", (channel) => {
    try {
      if (channel.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Channel Deleted")
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .addFields({ name: `Channel`, value: `${channel}` })

        .setFooter({ text: `Channel Deleted`,iconURL: `${client.user.displayAvatarURL()}` });

      return send_log(channel.guild.id, embed);
    } catch (err) {
      console.log("Err logging channel delete");
    }
  });
}

module.exports = { logging };
