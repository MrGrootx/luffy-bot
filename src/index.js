const {
  AttachmentBuilder,
  MessageType,
  Client,
  Partials,
  GatewayIntentBits,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection,
  Events,
  AuditLogEvent,
  MessageCollector,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Integration,
  ComponentType,
  GuildPresences,
} = require(`discord.js`);

const fs = require("fs");

// DASHBOARD
const path = require("path");
const express = require("express");
const os = require("os");
const app = express();

// music stuff
const { DisTube } = require("distube");



const client = new Client({
  intents: [
    Object.keys(GatewayIntentBits),
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
  presence: {
    status: "idle",
  },
});
// For Music For More Commands
module.exports = client;
// DASHBOARD
app.enable("trust proxy"); // if the ip is ::1 it means localhost
app.set("etag", false); // disabe cache

app.use(express.static(__dirname + "/dashboard"));
// exporting main index to dashboard index
module.exports.client = client;
client.setMaxListeners(0)
// COOLDOWN HAND
client.cooldown = new Collection();

// MUSIC LINE FILE
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const Logs = require("discord-logs");

client.commands = new Collection();
client.prefix = new Map();

require("dotenv").config();

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const prefixFolders = fs
  .readdirSync("./src/prefixcommands")
  .filter((f) => f.endsWith(".js"));

for (arx of prefixFolders) {
  const Cmd = require("./prefixcommands/" + arx);
  client.prefix.set(Cmd.name, Cmd);
}

// DASHBOARD REQUEST HANDLER
// GeT all the files in the public folder that ends with .js
let files = fs
  .readdirSync("./src/dashboard/public")
  .filter((f) => f.endsWith("js"));

// Looping thru all files
files.forEach((f) => {
  // requiring the file
  const file = require(`./dashboard/public/${f}`);
  if (file && file.name) {
    // if the file name
    app.get(file.name, file.run);
    console.log(`[Dashboard] - Loaded ${file.name}`);
  }
});

// error handling start
const process = require("node:process");

process.on("unhandledRejection", async (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Expection:", err);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("Uncaught Expection Monitor", err, origin);
});

// error handling end]

// MUSIC

module.exports = client;

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true, // you can change this to your needs
  emitAddSongWhenCreatingQueue: false,

  plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()],
});

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.login(process.env.token);
})();

client.handleEvents(eventFiles, "./src/events");
client.handleCommands(commandFolders, "./src/commands");
//DASHBOARD
app.listen(process.env.PORT || 90, () =>
  console.log(`[DASHBORD] port on ${process.env.PORT || 90}`)
);

Logs(client, {
  debug: true,
});

const { logging } = require("./events/logging");

client.login(process.env.token).then(() => {
  logging(client);
});

// Prefix Handler
client.on("messageCreate", async (message) => {
  const prefix = process.env.PREFIX;

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const prefixcmd = client.prefix.get(command);

  if (prefixcmd) {
    prefixcmd.run(client, message, args);
  }
});

// REPORT SYSTEM

const reportSchema = require("./schemas.js/reportSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "modal") {
    const contact = interaction.fields.getTextInputValue("contact");
    const issue = interaction.fields.getTextInputValue("issue");
    const description = interaction.fields.getTextInputValue("description");

    const member = interaction.user.id;
    const tag = interaction.user.tag;
    const server = interaction.guild.name;

    const embed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setTitle("Report Received")
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        { name: "Contact", value: `${contact}`, inline: true },
        { name: "Issue", value: `${issue}`, inline: true },
        { name: "Description", value: `${description}`, inline: true }
      )
      // .addFields(
      //   { name: ' USER INFO', value: ` `},
      //   { name: 'User Tag', value: `${tag}`},
      //   { name: 'User ID', value: `${member}`},
      //   { name: 'Server', value: `${server}`},
      //   { name: 'Date', value: `${new Date().toLocaleString()}`},

      // )
      .setDescription(
        ` **User info**\nName : ${tag} <@${member}>
    Form Submitted Date: ${new Date().toLocaleString()}
    Joined: ${interaction.guild.members.cache
      .get(member)
      .joinedAt.toLocaleString()}
    Created: ${interaction.guild.members.cache
      .get(member)
      .user.createdAt.toLocaleString()}
    `
      )
      .setFooter({ text: `Author ID : ${member}` })
      .setTimestamp();

    reportSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (!data) return;

      if (data) {
        const ChannelID = data.Channel;
        const channel = interaction.guild.channels.cache.get(ChannelID);

        channel.send({ embeds: [embed] });

        await interaction
          .reply({ content: `Your report has been submitted`, ephemeral: true })
          .catch((err) => {
            return;
          });
      }
    });
  }
});

// BUG REPORT SYSTEM [ TO BOT DEVELOPER]
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "bugreportdev") {
    const command = interaction.fields.getTextInputValue("command");
    const description = interaction.fields.getTextInputValue("description");

    const id = interaction.user.id;
    const member = interaction.member;
    const server = interaction.guild.id || "No Server provided";
    const servername = interaction.guild.name || "No Server provided";
    const channel = await client.channels.cache.get(
      process.env.BUG_REPORT_CHANNEL
    );

    const embed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setTitle(`Bug Report Received`)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields({ name: "Member", value: `${member}` })
      .addFields({ name: `Server`, value: ` ${servername} | ID (${server})` })
      .addFields({ name: `Command`, value: `${command}` })
      .addFields({ name: `Description`, value: `${description}` })
      .setTimestamp()
      .setFooter({ text: `Author ID : ${id}` });

    await channel.send({ embeds: [embed] }).catch((err) => {
      console.log(err);
    });

    await interaction.reply({
      content: `**Your report has been submitted**`,
      ephemeral: true,
    });
  }
});

// REMINDER SYSTEM

const reminderSchema = require("./schemas.js/remindSchema");
setInterval(async () => {
  const reminder = await reminderSchema.find();
  if (!reminder) return;
  else {
    reminder.forEach(async (reminder) => {
      if (reminder.Time > Date.now()) return;

      const user = await client.users.fetch(reminder.User);

      user
        ?.send({
          content: `${user}, You asked me to remind you about ${reminder.Remind}
        \n`,
        })
        .catch((err) => {});

      await reminderSchema.deleteMany({
        Time: reminder.Time,
        User: user.id,
        Remind: reminder.Remind,
      });
    });
  }
}, 1000 * 5);

// JOINLOG SYSTEM
const joinLogSchema = require("./schemas.js/joinLogSchema");
client.on(Events.GuildMemberAdd, async (interaction, message) => {
  const datachannel = await joinLogSchema.findOne({
    GuildID: interaction.guild.id,
  });
  if (!datachannel) return;
  const channel = await client.channels.cache.get(datachannel.ChannelID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("NotQuiteBlack")
    .setAuthor({
      name: interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(
      `${interaction.user}  just joined the server\n
  **ID** : ${interaction.user.id}
  **Full Name** : ${interaction.user.tag}
  **Join Discord** : <t:${Math.floor(
    interaction.user.createdTimestamp / 1000
  )}:R>`
    )
    .setTimestamp();

  await channel.send({ embeds: [embed] });
});

// CAPTCHA SYSTEM

// const { CaptchaGenerator } = require("captcha-canvas");
// const capSchema = require("./schemas.js/captchaSchema");
// let guild;
// const buttonDisabledTimeout = 5 * 60 * 1000;
// client.on(Events.GuildMemberAdd, async (member) => {
//   const Data = await capSchema.findOne({ Guild: member.guild.id });
//   if (!Data) return;
//   else {
//     const cap = Data.Captcha;

//     const captcha = new CaptchaGenerator()
//       .setDimension(150, 450)
//       .setCaptcha({ text: `${cap}`, size: 60, color: "green" })
//       .setDecoy({ opacity: 0.5 })
//       .setTrace({ color: "green" });
//     console.log(captcha);
//     const buffer = await captcha.generateSync(); // Use await here

//     const attachment = new AttachmentBuilder(buffer, { name: "captcha.png" });

//     const embed = new EmbedBuilder()
//       .setColor("NotQuiteBlack")
//       .setImage("attachment://captcha.png")
//       .setTitle(`Solve the captcha to get access to the server`)
//       .addFields({
//         name: `🔴 Note:`,
//         value: `You have 5 minutes to solve the captcha`,
//       })
//       .setTimestamp()
//       .setFooter({ text: `Use the button below to solve the captcha` });

//     const capBtn = new ActionRowBuilder().addComponents(
//       new ButtonBuilder()
//         .setCustomId("capbtn")
//         .setLabel("Submit")
//         .setStyle(ButtonStyle.Secondary)
//         .setDisabled(false)
//     );

//     const capmodal = new ModalBuilder()
//       .setTitle("Submit Captcha Answer")
//       .setCustomId("capModal");

//     const answer = new TextInputBuilder()
//       .setCustomId("answer")
//       .setRequired(true)
//       .setLabel("Your captcha answer")
//       .setPlaceholder(
//         "Submit what you think the captcha is!  If you get it wrong you can try again"
//       )
//       .setStyle(TextInputStyle.Short);

//     const one = new ActionRowBuilder().addComponents(answer);

//     capmodal.addComponents(one);

//     const msg = await member
//       .send({ embeds: [embed], files: [attachment], components: [capBtn] })
//       .catch((err) => {
//         return;
//       });

//     const collector = msg.createMessageComponentCollector();

//     collector.on("collect", async (i) => {
//       if (i.customId === "capbtn") {
//         i.showModal(capmodal);
//       }

//       setTimeout(() => {
//         capBtn.components[0].setDisabled(true);
//         msg.edit({ components: [capBtn] });
//       }, buttonDisabledTimeout);
//     });

//     guild = member.guild;
//   }
// });

// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isModalSubmit()) return;

//   else {
//     if (interaction.customId === "capModal") {
//       const Data = await capSchema.findOne({ Guild: guild.id });

//       const answer = interaction.fields.getTextInputValue("answer");
//       const cap = Data.Captcha;

//       if (answer != `${cap}`)
//         return await interaction.reply({
//           content: `You got the captcha wrong, try again!`,
//           ephemeral: true,
//         });
//       else {
//         const RoleID = Data.Role;

//         const capGuild = await client.guilds.cache.get(guild.id);
//         const role = await capGuild.roles.cache.get(RoleID);

//         const member = await capGuild.members.fetch(interaction.user.id);

//         await member.roles.add(role).catch((err) => {
//           interaction.reply({
//             content: `There was an error adding the role`,
//             ephemeral: true,
//           });
//         });

//         await interaction.reply({
//           content: `You have been Verified within ${capGuild.name}`,
//         });
//       }
//     }
//     // const Data = await capSchema.findOne({ Guild: guild.id });

//   }
// });
// client.on(Events.InteractionCreate, async interaction => {
//   if(!interaction.isModalSubmit()) return
//   else {
//     if(!interaction.customId === 'capModal') return;
//     const Data = await capSchema.findOne({ Guild: guild.id })

//     const answer = interaction.fields.getTextInputValue('answer')
//     const cap = Data.Captcha

//     if(answer != `${cap}`) return await interaction.reply({ content: `That was worng! Try again`, ephemeral: true})
//     else {
//       const roleID = Data.Role

//       const capGuild = await client.guilds.fetch(guild.id);
//       const role = await capGuild.roles.cache.get(roleID);

//       const member = await capGuild.members.fetch(interaction.user.id);

//       await member.roles.add(role).catch(err => {
//         interaction.reply({ content: `There was an error verifying, contact server staff to proceed`, ephemeral: true})
//       })

//       await interaction.reply({content: `You have been Verified within ${capGuild.name}`,})
//     }
//   }
// })

// CAP END

// AUTOROLE SYSTTEM

const autoroleSchema = require("./schemas.js/autoroleSchema");

client.on(Events.GuildMemberAdd, async (interaction) => {
  const member = interaction.user.id;

  autoroleSchema.findOne(
    { GuildID: interaction.guild.id },
    async (err, data) => {
      if (err) {
        console.log(err);
      }

      if (data) {
        const RoleID = data.RoleID;
        const role = await interaction.guild.roles.cache.get(RoleID);
        await interaction.guild.members
          .fetch(member)
          .then((member) => {
            member.roles.add(role);
            console.log(member.user.username, `Role Added`);
          })
          .catch((err) => {
            console.log(err);
            return;
          });
      }
    }
  );
});

//BOT PING
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content.includes(process.env.BOT_ID)) {
    const pingEmbed = new EmbedBuilder()

      .setColor("NotQuiteBlack")
      .setTitle("``📌`` Who mentioned me?")
      .setDescription(
        `Hey there ${message.author.username}!, here is some useful information about me.\n**How to view all commands?**\nEither use **/help** to view a list of all the commands!`
      )

      .addFields({
        name: "``💾`` Servers:",
        value: `${client.guilds.cache.size}`,
        inline: true,
      })
      .addFields({
        name: "``👥`` Users:",
        value: `${client.users.cache.size}`,
        inline: true,
      })
      .addFields({
        name: "``📡`` Commands:",
        value: `${client.commands.size}`,
        inline: true,
      })
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ size: 64 }))
      .setFooter({ text: `Requested by ${message.author.username}.` });
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setURL(process.env.BOT_INVITE)
        .setStyle(ButtonStyle.Link)
    );

    return message.channel.send({ embeds: [pingEmbed], components: [buttons] });
  }
});

// ANTI-LINK SYSTEM

const linkSchema = require("./schemas.js/anti-link");
const { totalmem, cpus } = require("os");
const { re } = require("mathjs");
client.on(Events.MessageCreate, async (message) => {
  if (
    message.content.startsWith("http") ||
    message.content.startsWith("discord.gg") ||
    message.content.includes("discord.gg/") ||
    message.content.includes("https://") ||
    message.content.startsWith("www.") ||
    message.content.includes(".com") ||
    message.content.includes(".net.") ||
    message.content.includes(".org")
  ) {
    const Data = await linkSchema.findOne({ Guild: message.guild.id });

    if (!Data) return;

    const memberPerms = Data.Perms;

    const user = message.author;
    const member = message.guild.members.cache.get(user.id);

    if (member.permissions.has(memberPerms)) return;

    user.send({
      content: `<@${user.id}>, sending links from that website isn't allowed in **${message.guild.name}**!`,
    });

    message.channel
      .send({
        content: `<@${user.id}>, sending links from that website isn't allowed in **${message.guild.name}**!`,
      })
      .then((msg) => {
        setTimeout(() => msg.delete(), 3000);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    (await message).delete();
  }
});

// DASHBOARD
// app.get("/", async (req, res) => {

//   // const ram = os.totalmem() / 1000
//   // const cores = os.cpus().length
//   // const cpus = os.cpus()[0].model

//   // const users = client.users.cache.size
//   const users = await client.guilds.cache.reduce(
//     (a, b) => a + b.memberCount,
//     0
//   );
//   const guilds = client.guilds.cache.size

//   const filePath = path.join(__dirname, 'dashboard/html/home.html');
//   let file = fs.readFileSync(filePath, { encoding: 'utf8' });

//   // file = file.replace("$$ram$$", ram)
//   // file = file.replace("$$cores$$", cores)
//   // file = file.replace("$$cpu$$", cpus)

//   file = file.replace("$$users$$", users)
//   file = file.replace("$$guilds$$", guilds)

//   res.send(file)
//   // res.sendFile('./dashboard/html/home.html', { root: __dirname })

// })

// GUILD ADD
const globalUser = require("./schemas.js/Global_Guild_Owner");
client.on("guildCreate", async (guild) => {
  const owner = await guild.members.fetch(guild.ownerId);

  await globalUser.findOne({ GuildID: guild.id });

  await globalUser.create({
    GuildID: guild.id,
    OwnerId: owner.id,
  });

  if (owner) {
    const embed = new EmbedBuilder();

    owner
      .send({
        embeds: [
          embed
            .setColor("NotQuiteBlack")
            .setTitle(
              `<:tickYes:1163338874186117230> Thanks for adding me to your server`
            )
            .setFooter({
              text: `Sended By : Luffy Team`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  }
});

// GUILD REMOVE
client.on("guildDelete", async (guild) => {
  const owner = await guild.members.fetch(guild.ownerId);

  const data = await globalUser.findOne({ GuildID: guild.id });

  if (!data) return;

  if (data) {
    await globalUser.deleteOne({ GuildID: guild.id });
  }

  if (owner) {
    const embed = new EmbedBuilder();

    owner
      .send({
        embeds: [
          embed
            .setColor("NotQuiteBlack")
            .setDescription(
              `<:tickNo:1163338851192930314> I was removed from your server, **${owner.user.username}** 
            If you want to add me back to your server,Here you can [Add Me](https://discord.com/api/oauth2/authorize?client_id=1157966419460374558&permissions=8&scope=bot%20applications.commands).`
            )
            .setFooter({
              text: `Sended By : Luffy Team`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  }
});

// TICKET SYSTEM
const { createTranscript } = require("discord-html-transcripts");
const ticketSchema = require("./schemas.js/ticketSchema");
let cancelmsg;

client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;

  if (interaction.isButton()) {
    if (customId === "create-ticket") {
      let data = await ticketSchema.findOne({ GuildID: guild.id });

      if (!data)
        return await interaction.reply({
          content: "Ticket panel is not setup",
          ephemeral: true,
        });

      const role = guild.roles.cache.get(data.Role);
      const category = guild.channels.cache.get(data.Category);
      const channel = interaction.guild.channels.cache.find(
        (c) =>
          c.topic && c.topic.includes(`Ticket Owner: ${interaction.user.id}`)
      );

      if (channel) {
        return await interaction.reply({
          content: `You already have a ticket open <#${channel.id}>`,
          ephemeral: true,
        });
      }

      await interaction.guild.channels
        .create({
          name: `ticket-${interaction.user.username}`,
          parent: category,
          type: ChannelType.GuildText,
          topic: `Ticket Owner: ${interaction.user.id}`,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ["ViewChannel"],
            },
            {
              id: role.id,
              allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            },
            {
              id: interaction.member.id,
              allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            },
          ],
        })
        .then(async (channel) => {
          const openembed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setDescription(
              `Welcome to your ticket, **${interaction.user.username}**`
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}'s Tickets` });

          const ticketBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("close-ticket")
              .setLabel("Close Ticket")
              .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
              .setCustomId("ping-ticket-staff")
              .setEmoji("🔔")
              .setStyle(ButtonStyle.Primary)
          );

          await channel.send({ embeds: [openembed], components: [ticketBtn] });

          const openTicket = new EmbedBuilder().setDescription(
            `Ticket created in <#${channel.id}>`
          );

          await interaction.reply({ embeds: [openTicket], ephemeral: true });
        });
    }

    if (customId === "close-ticket") {
      const ticketcloseEmbed = new EmbedBuilder()
        .setDescription("are you sure you want to close this ticket?")
        .setColor("NotQuiteBlack");

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close-ticket-confirm")
          .setEmoji("✅")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("close-ticket-cancel")
          .setEmoji("✖")
          .setStyle(ButtonStyle.Danger)
      );
      cancelmsg = await interaction.reply({
        embeds: [ticketcloseEmbed],
        components: [button],
      });
    }

    if (customId === "close-ticket-confirm") {
      let data = await ticketSchema.findOne({ GuildID: guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `Ticket-${interaction.user.username}.html`,
      });

      const transcriptEmbed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setAuthor({
          name: `${interaction.guild.name}'s Transcripts`,
          iconURL: guild.iconURL(),
        })
        .addFields({ name: `Closed By `, value: `${interaction.user.tag}` })
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: `${interaction.guild.name}'s Tickets` });

      const precessEmbed = new EmbedBuilder()
        .setDescription("Closing ticket in 10 seconds...")
        .setColor("NotQuiteBlack");

      await interaction.reply({ embeds: [precessEmbed] });

      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });

      setTimeout(() => {
        interaction.channel.delete();
      }, 10000);
    }

    if (customId === "close-ticket-cancel") {
      const cancelEmbed = new EmbedBuilder()
        .setDescription("Canceling...")
        .setColor("NotQuiteBlack");

      const message = await interaction.reply({ embeds: [cancelEmbed] });
      let deletereturnmsg; // deleting  cancled embed  message

      setTimeout(async () => {
        message.delete();

        const canceledEmbed = new EmbedBuilder()
          .setDescription(
            `Ticket Closing Canceled.. 
          Press again to close the ticket `
          )
          .setColor("NotQuiteBlack")
          .setTimestamp()
          .setFooter({
            text: `Luffy Ticket System`,
            iconURL: client.user.displayAvatarURL(),
          });

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close-ticket-confirm")
            .setEmoji("✅")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),

          new ButtonBuilder()
            .setCustomId("close-ticket-cancel")
            .setEmoji("✖")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );

        if (cancelmsg) {
          // Check if cancelmsg exists before trying to edit it
          deletereturnmsg = await cancelmsg.edit({
            embeds: [canceledEmbed],
            components: [button],
          });
        }
      }, 5000);
    }

    // Ticket Ping Staff
    if (customId === "ping-ticket-staff") {
      const data = await ticketSchema.findOne({ GuildID: guild.id });

      const staff = guild.roles.cache.get(data.Role);

      interaction
        .reply({
          content: `Hello <@&${staff.id}> , ${interaction.user.username} need some help`,
        })
        .catch((err) => {
          console.error(err);
          return;
        });
    }
  }
});

// JOIN TO CREATE VC
const jointocreateSchemaSetup = require("./schemas.js/joinToCreateSetup");
const joinchannelSchema = require("./schemas.js/joinToCreate-channels");

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (newState.member.guild === null) return;
  } catch (error) {
    return;
  }

  const joindata = await jointocreateSchemaSetup.findOne({
    Guild: newState.guild.id,
  });
  const joinchanneldata = await joinchannelSchema.findOne({
    Guild: newState.member.guild.id,
    User: newState.member.id,
  });

  const voiceChannel = newState.channel;

  if (!joindata) return;
  if (!voiceChannel) return;
  else {
    if (voiceChannel.id === joindata.Channel) {
      if (joinchanneldata) {
        try {
          return await newState.member.send({
            content: "**You already have a voice channel open right now**",
            ephemeral: true,
          });
        } catch (error) {
          return;
        }
      } else {
        try {
          const channel = await newState.member.guild.channels.create({
            name: `${newState.member.user.username}-room`,
            type: ChannelType.GuildVoice,
            userLimit: joindata.VoiceLimit,
            parent: joindata.Category,
          });
          try {
            await newState.member.voice.setChannel(channel);
          } catch (error) {
            return;
          }

          setTimeout(() => {
            joinchannelSchema.create({
              Guild: newState.member.guild.id,
              Channel: channel.id,
              User: newState.member.id,
            });
          }, 500);
        } catch (error) {
          try {
            await newState.member.send({
              content: `I could not create your channel, I may be missing Permissions`,
            });
          } catch (error) {
            return;
          }

          return;
        }

        const data = await jointocreateSchemaSetup.findOne({
          Guild: oldState.guild.id,
        });

        if (!data) return;

        const embed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setTimestamp()
          .setTitle("Channel Created")
          .addFields(
            // { name: "Channel Name", value: `${channel.name}` },
            // { name: "Channel ID", value: `${channel.id}` },
            { name: "Channel Owner", value: `${newState.member.user.tag}` },
            { name: "Channel Owner ID", value: `${newState.member.id}` },
            {
              name: "Channel Created Guild in",
              value: `${newState.member.guild.name}`,
            }
          );

        const logsend = data.Log;
        const sendlogchannel = await oldState.member.guild.channels.cache.get(
          logsend
        );

        await sendlogchannel.send({ embeds: [embed] });
      }
    }
  }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (oldState.member.guild === null) return;
  } catch (error) {
    return;
  }

  const leavechanneldata = await joinchannelSchema.findOne({
    Guild: oldState.member.guild.id,
    User: oldState.member.id,
  });

  if (!leavechanneldata) return;
  else {
    const voiceChannel = await oldState.member.guild.channels.cache.get(
      leavechanneldata.Channel
    );

    try {
      await voiceChannel.delete();
    } catch (error) {
      return;
    }

    await joinchannelSchema.deleteMany({
      Guild: oldState.guild.id,
      User: oldState.member.id,
    });

    try {
      const data = await jointocreateSchemaSetup.findOne({
        Guild: oldState.guild.id,
      });
      if (!data) return;

      const embed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setTimestamp()
        .setTitle("Channel Deleted")
        .addFields(
          { name: "Channel Name", value: `${voiceChannel.name}` },
          { name: "Channel ID", value: `${voiceChannel.id}` },
          { name: "Channel Owner", value: `${oldState.member.user.tag}` },
          { name: "Channel Owner ID", value: `${oldState.member.id}` },
          {
            name: "Channel Deleted Guild in",
            value: `${newState.member.guild.name}`,
          }
        );

      const logsend = data.Log;

      const sendlogchannel = await oldState.member.guild.channels.cache.get(
        logsend
      );

      await sendlogchannel.send({ embeds: [embed] });
    } catch (error) {
      return;
    }
  }
});

// SUGGESTIONS SYSTEM
const suggestSchema = require("./schemas.js/SuggestionSchema-setup");
const suggestdata = require("./schemas.js/suggestion");

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.guild) return;
  if (!interaction.message) return;
  if (!interaction.isButton) return;

  const data = await suggestdata.findOne({
    guildId: interaction.guild.id,
    messageID: interaction.message.id,
  });
  if (!data) return;

  const { fields } = interaction;

  const message = await interaction.channel.messages.fetch(data.messageID);
  const user = await client.users.fetch(data.userID);
  const messagecontent = data.MessageContent;

  if (interaction.customId == "suggest_accept_btn") {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    )
      return await interaction.reply({
        content: `**Only Admins & Staffs can use this button.**`,
        ephemeral: true,
      });

    const embed = new EmbedBuilder();

    await message
      .edit({
        embeds: [
          embed
            .setColor("Green")
            .setAuthor({
              name: "Suggestion was accepted",
              iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(`${user.username}`)
            .setDescription(`> ${messagecontent}`)
            .setThumbnail(user.displayAvatarURL({ size: 64 }))
            .addFields({
              name: `Accepted By:`,
              value: `<@${interaction.user.id}>`,
            })
            .setFooter({
              text: `Status: Accepted | ${interaction.createdAt.toDateString()}`,
            }),
        ],
        components: [],
      })
      .catch((err) => {
        console.error(err);
        return;
      });

    await suggestdata.deleteOne({ guildId: interaction.guild.id });
  }

  if (interaction.customId == "suggest_deny_btn") {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    )
      return await interaction.reply({
        content: `**Only Admins & Staffs can use this button.**`,
        ephemeral: true,
      });

    const embed = new EmbedBuilder();
    await message
      .edit({
        embeds: [
          embed
            .setColor("Red")
            .setAuthor({
              name: `Suggestion was declined`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`> ${messagecontent}`)
            .setTitle(`${user.username}`)
            .setFooter({
              text: `Status: Declined | ${interaction.createdAt.toDateString()}`,
            })
            .setThumbnail(user.displayAvatarURL({ size: 64 }))
            .addFields({
              name: `Declined By:`,
              value: `<@${interaction.user.id}>`,
            }),
        ],
        components: [],
      })
      .catch((err) => {
        console.error(err);
        return;
      });

    await suggestdata.deleteOne({ guildId: interaction.guild.id });
  }
});

const axios = require("axios");
client.on("messageCreate", async (interaction) => {
  if (interaction.content === "test") {
    const options = {
      method: "GET",
      url: "https://free-epic-games.p.rapidapi.com/free",
      headers: {
        "X-RapidAPI-Key": "884f0f23b6mshd312e2a7b54a101p1da811jsn411bf075d903",
        "X-RapidAPI-Host": "free-epic-games.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
});

// TEST

client.on('ready', () => {

  let guild = client.guilds.cache.get("1112106400131330099");

  client.channels.cache
    .get("1158718654272254022")
    .setName(`Total users - ${guild.memberCount}`);
  client.channels.cache
    .get("1158723125358362746")
    .setName(`Members - ${guild.members.cache.filter(member => !member.user.bot).size} `)
    
  client.channels.cache
    .get("1158719065964159016")
    .setName(
      `Bots - ${
        guild.members.cache.filter((member) => member.user.bot).size
      }`
    );

    

    // FUncation
    function statusCount() {
      client.channels.cache.get("1144707326327144529")
      .setName(`🟢 ${guild.members.cache.filter(m => m.presence?.status == 'online').size} 
      🔴  ${guild.members.cache.filter(m => m.presence?.status == 'dnd').size} 
      🌙  ${guild.members.cache.filter(m => m.presence?.status == 'idle').size}
      ⚫  ${guild.members.cache.filter(m => m.presence?.status == 'offline' || !m.presence).size}`)
      // set the channel name to status..
      // online, dnd, idle, offline

    } statusCount()

    setInterval(() => {
      statusCount()
    
    },60000)

})

client.on("guildMemberAdd", (member) => {
  client.channels.cache
    .get("1158718654272254022")
    .setName(`Total users - ${member.guild.memberCount}`);
  client.channels.cache
    .get("1158719025686249482")
    .setName(
      `Members - ${member.guild.members.cache.filter(
        (member) => !member.user.bot
      )}`
    );
  client.channels.cache
    .get("1158719065964159016")
    .setName(
      `Bots - ${
        member.guild.members.cache.filter((member) => member.user.bot).size
      }`
    );
});

client.on("guildMemberRemove", (member) => {
  client.channels.cache
    .get("1158718654272254022")
    .setName(`Total users - ${member.guild.memberCount}`);
  client.channels.cache
    .get("1158719025686249482")
    .setName(
      `Members - ${member.guild.members.cache.filter(
        (member) => !member.user.bot
      )}`
    );
  client.channels.cache
    .get("1158719065964159016")
    .setName(
      `Bots - ${
        member.guild.members.cache.filter((member) => member.user.bot).size
      }`
    );
});

