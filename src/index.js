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


