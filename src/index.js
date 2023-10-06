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

// error handling end

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


