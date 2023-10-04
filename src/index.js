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

const reportSchema = require('./schemas.js/reportSchema');
client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isModalSubmit()) return;

  if(interaction.customId === 'modal') {
    const contact = interaction.fields.getTextInputValue('contact');
    const issue = interaction.fields.getTextInputValue('issue');
    const description = interaction.fields.getTextInputValue('description');

    const member = interaction.user.id;
    const tag = interaction.user.tag;
    const server = interaction.guild.name;

    const embed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setTitle('Report Received')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
    .addFields(
      { name: 'Contact', value: `${contact}`, inline: true},
      { name: 'Issue', value: `${issue}`, inline: true},
      { name: 'Description', value: `${description}`, inline: true},
    )
    // .addFields(
    //   { name: ' USER INFO', value: ` `},
    //   { name: 'User Tag', value: `${tag}`},
    //   { name: 'User ID', value: `${member}`},
    //   { name: 'Server', value: `${server}`},
    //   { name: 'Date', value: `${new Date().toLocaleString()}`},

    // )
    .setDescription(` **User info**\nName : ${tag} <@${member}>
    Form Submitted Date: ${new Date().toLocaleString()}
    Joined: ${interaction.guild.members.cache.get(member).joinedAt.toLocaleString()}
    Created: ${interaction.guild.members.cache.get(member).user.createdAt.toLocaleString()}
    `)
    .setFooter({ text: `Author ID : ${member}`})
    .setTimestamp()
    

    reportSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if(!data) return;

      if(data) {
        const ChannelID = data.Channel
        const channel = interaction.guild.channels.cache.get(ChannelID)

        channel.send({ embeds: [embed]})

        await interaction.reply({ content: `Your report has been submitted`, ephemeral: true})
        .catch((err) => {
          return
        })
      }
    })
    
  }
})