const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const warningSchema = require("../../schemas.js/warning");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("warn a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("add a warning to a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("the user you want to warn")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("the reason for the warning")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("evidence")
            .setDescription("Provide evedence")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("check warning of user ")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("the user you want to check")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a specific warning from a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("the user you want to remove")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("Provide the user warning id")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("clear all warning from a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("user you want to clear warnings")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const { options, member, user, guildId } = interaction;

    const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
    const target = options.getUser("target");
    const reason = options.getString("reason") || "No reason provided";
    const evidence = options.getString("evidence") || "No evidence provided";
    const warnId = options.getInteger("id") - 1;
    const warnDate = new Date(
      interaction.createdTimestamp
    ).toLocaleDateString();

    const usertag = `${target.username}#${target.discriminator}`;

    const embed = new EmbedBuilder();

    switch (sub) {
      case "add":
        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: usertag },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              data = new warningSchema({
                GuildID: guildId,
                UserID: target.id,
                UserTag: usertag,
                Content: [
                  {
                    ExecuterId: user.id,
                    ExecuterTag: user.tag,
                    Reason: reason,
                    Evidence: evidence,
                    Date: warnDate,
                  },
                ],
              });
            } else {
              const warnContent = {
                ExecuterId: user.id,
                ExecuterTag: user.tag,
                Reason: reason,
                Evidence: evidence,
                Date: warnDate,
              };
              data.Content.push(warnContent);
            }
            data.save();
          }
        );

        embed
          .setColor("NotQuiteBlack")
          .setDescription(
            `Warning added: ${usertag} | ID : ${target.id} \n
        **Reason:** ${reason} \n
        **Evidence:** ${evidence}`
          )
          .setFooter({ text: `Warned by ${user.tag}` })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });

        break;

      case "check":
        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: usertag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              embed
                .setColor("NotQuiteBlack")
                .setDescription(
                  `${data.Content.map(
                    (w, i) =>
                      `**ID** : ${i + 1}
                        **By** : ${w.ExecuterTag}
                        **Date** : ${w.Date}
                        **Reason** : ${w.Reason}
                        **Evidence** : ${w.Evidence}\n\n`
                  ).join(" ")}`
                )
                .setFooter({ text: `Warned by ${user.tag}` })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            } else {
              embed
                .setColor("NotQuiteBlack")
                .setDescription(
                  `${usertag} | ID : ${target.id} has no warning..`
                )
                .setFooter({ text: `Warned by ${user.tag}` })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );

        break;
      case "remove":
        // ...
        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: usertag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              // Ensure warnId is within a valid range
              if (warnId >= 0 && warnId < data.Content.length) {
                data.Content.splice(warnId, 1);
                data.save();

                embed
                  .setColor("NotQuiteBlack")
                  .setDescription(
                    `${usertag}'s warning id: ${warnId + 1} has been removed..`
                  )
                  .setFooter({ text: `Warned by ${user.tag}` })
                  .setTimestamp();

                interaction.reply({ embeds: [embed] });
              } else {
                embed
                  .setColor("NotQuiteBlack")
                  .setDescription(
                    `${usertag} | ID : ${target.id} has no warning with ID ${
                      warnId + 1
                    }..`
                  )
                  .setFooter({ text: `Warned by ${user.tag}` })
                  .setTimestamp();

                interaction.reply({ embeds: [embed] });
              }
            } else {
              embed
                .setColor("NotQuiteBlack")
                .setDescription(
                  `${usertag} | ID : ${target.id} has no warning..`
                )
                .setFooter({ text: `Warned by ${user.tag}` })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );

        break;
      case "clear":
        // ...
        warningSchema.findOneAndDelete(
          { GuildID: guildId, UserID: target.id, UserTag: usertag },
          (err, data) => {
            if (err) throw err;

            if (data) {
              embed
                .setColor("NotQuiteBlack")
                .setDescription(
                  `${usertag}'s warnings were cleared | ||${target.id}||`
                )
                .setFooter({ text: `Cleared by ${user.tag}` })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            } else {
              embed
                .setColor("NotQuiteBlack")
                .setDescription(
                  `${usertag} | ID : ${target.id} has no warnings to clear..`
                )
                .setFooter({ text: `Warned by ${user.tag}` })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );

        break;
    }
  },
};
