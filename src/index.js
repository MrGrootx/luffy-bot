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

// music stuff
const { DisTube } = require("distube");
// const prefix = '?';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildScheduledEvents,
  ],
  partials: [
    Partials.Channel,
    Partials.Reaction,
    Partials.Message,
    Partials.GuildMember,
  ],
});

// music
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

const { CaptchaGenerator } = require("captcha-canvas");
const capSchema = require("./schemas.js/captchaSchema");
let guild;
const buttonDisabledTimeout = 5 * 60 * 1000;
client.on(Events.GuildMemberAdd, async (member) => {
  const Data = await capSchema.findOne({ Guild: member.guild.id });
  if (!Data) return;
  else {
    const cap = Data.Captcha;

    const captcha = new CaptchaGenerator()
      .setDimension(150, 450)
      .setCaptcha({ text: `${cap}`, size: 60, color: "green" })
      .setDecoy({ opacity: 0.5 })
      .setTrace({ color: "green" });
    console.log(captcha);
    const buffer = await captcha.generateSync(); // Use await here

    const attachment = new AttachmentBuilder(buffer, { name: "captcha.png" });

    const embed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setImage("attachment://captcha.png")
      .setTitle(`Solve the captcha to get access to the server`)
      .addFields({
        name: `🔴 Note:`,
        value: `You have 5 minutes to solve the captcha`,
      })
      .setTimestamp()
      .setFooter({ text: `Use the button below to solve the captcha` });

    const capBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("capbtn")
        .setLabel("Submit")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
    );

    const capmodal = new ModalBuilder()
      .setTitle("Submit Captcha Answer")
      .setCustomId("capModal");

    const answer = new TextInputBuilder()
      .setCustomId("answer")
      .setRequired(true)
      .setLabel("Your captcha answer")
      .setPlaceholder(
        "Submit what you think the captcha is!  If you get it wrong you can try again"
      )
      .setStyle(TextInputStyle.Short);

    const one = new ActionRowBuilder().addComponents(answer);

    capmodal.addComponents(one);

    const msg = await member
      .send({ embeds: [embed], files: [attachment], components: [capBtn] })
      .catch((err) => {
        return;
      });

    const collector = msg.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId === "capbtn") {
        i.showModal(capmodal);
      }

      setTimeout(() => {
        capBtn.components[0].setDisabled(true);
        msg.edit({ components: [capBtn] });
      }, buttonDisabledTimeout);
    });

    guild = member.guild;
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  else {
    if (!interaction.customId === "capModal") return;
    // const Data = await capSchema.findOne({ Guild: guild.id });
    const Data = await capSchema.findOne({ Guild: guild.id });

    const answer = interaction.fields.getTextInputValue("answer");
    const cap = Data.Captcha;

    if (answer != `${cap}`)
      return await interaction.reply({
        content: `You got the captcha wrong, try again!`,
        ephemeral: true,
      });
    else {
      const RoleID = Data.Role;

      const capGuild = await client.guilds.cache.get(guild.id);
      const role = await capGuild.roles.cache.get(RoleID);

      const member = await capGuild.members.fetch(interaction.user.id);

      await member.roles.add(role).catch((err) => {
        interaction.reply({
          content: `There was an error adding the role`,
          ephemeral: true,
        });
      });

      await interaction.reply({
        content: `You have been Verified within ${capGuild.name}`,
      });
    }
  }
});

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

      if(data) {
        const RoleID = data.RoleID;
        const role = await interaction.guild.roles.cache.get(RoleID);
        await interaction.guild.members.fetch(member).then(member => {
          member.roles.add(role);
          console.log(member.user.username , `Role Added`)
        }).catch(err => {
          console.log(err)
          return;
        })
      }
      
    }
  );
});
