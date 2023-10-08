const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Random images gen.")
    .addSubcommand((option) =>
      option.setName("cat").setDescription("Get random images of cats.")
    )
    .addSubcommand((option) =>
      option
        .setName("lgbt")
        .setDescription("LGBTQIA!!!")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("passed")
        .setDescription("Passed.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    )
    .addSubcommand((option) =>
      option.setName("dog").setDescription("Get random images of dogs.")
    )
    .addSubcommand((option) =>
      option
        .setName("comrade")
        .setDescription("Salute!")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("blue")
        .setDescription("Blue'ed someone's avatar.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("blurple")
        .setDescription("Get blurple filtered avatar.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("heart")
        .setDescription("Hearts.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("horny")
        .setDescription("Uhm...")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("oogway")
        .setDescription("Master Oogway:)")
        .addStringOption((option) =>
          option
            .setName("quote")
            .setDescription("Input your wise words.")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("stupid")
        .setDescription("It's so stupid.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("genshin")
        .setDescription("Genshin Namecard.")
        .addIntegerOption((option) =>
          option
            .setName("birthday")
            .setDescription("Set your birthday.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("birthmonth")
            .setDescription("Set your birthmonth.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("birthyear")
            .setDescription("Set your birthyear.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("bio").setDescription("Input your bio.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("bisexual")
        .setDescription("Bisexual.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("blur")
        .setDescription("Get blurred avatars.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("nobitches")
        .setDescription("No Bitches?")
        .addStringOption((option) =>
          option.setName("no").setDescription("No bitches?")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("wasted")
        .setDescription("Wasted.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("triggered")
        .setDescription("Triggered.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("jail")
        .setDescription("Get jailed!")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("gay")
        .setDescription("Come out of the closet.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user.")
        )
    ),
  async execute(interaction) {
    const { options } = interaction;
    let user = options.getUser("user") || interaction.user;
    let avatarUrl = user.avatarURL({ size: 512, extension: "jpg" });
    const sub = options.getSubcommand();

    switch (sub) {
      case "cat":
        const url = "https://api.thecatapi.com/v1/images/search";
        const info = await fetch(url).then((res) => res.json());
        const image = await info[0].url;

        const embed = new EmbedBuilder()
          .setDescription("``😻`` Cat Images Generator")
          .setColor("NotQuiteBlack")
          .setImage(image);

        await interaction.reply({ embeds: [embed] });

        break;
      case "dog":
        const dogurl = "https://api.thedogapi.com/v1/images/search";
        const res = await fetch(dogurl).then((res) => res.json());
        const dogimg = await res[0].url;

        const dogembed = new EmbedBuilder()
          .setDescription("``🐶`` Dog Images Generator" )
          .setColor("NotQuiteBlack")
          .setImage(dogimg);

        await interaction.reply({ embeds: [dogembed] });

        break;
      case "blue":
        let canvas = `https://some-random-api.com/canvas/blue?avatar=${avatarUrl}`;

        await interaction.reply({ content: canvas });

        break;
      case "blurple":
        let blurplecanvas = `https://some-random-api.com/canvas/blurple?avatar=${avatarUrl}`;

        await interaction.reply({ content: blurplecanvas });

        break;
      case "heart":
        let heartcanvas = `https://some-random-api.com/canvas/heart?avatar=${avatarUrl}`;

        await interaction.reply({ content: heartcanvas });

        break;
      case "horny":
        let hcanvas = `https://some-random-api.com/canvas/horny?avatar=${avatarUrl}`;

        await interaction.reply({ content: hcanvas });

        break;
      case "oogway":
        let quote = options.getString("quote");
        let oogway = `https://some-random-api.com/canvas/oogway?avatar=${avatarUrl}&quote=${encodeURIComponent(
          quote
        )}`;

        await interaction.reply({ content: oogway });

        break;
      case "stupid":
        let stupidcanvas = `https://some-random-api.com/canvas/its-so-stupid?avatar=${avatarUrl}`;

        await interaction.reply({ content: stupidcanvas });

        break;
      case "genshin":
        let birthday = options.getInteger("birthday");
        let birthmonth = options.getInteger("birthmonth");
        let birthyear = options.getInteger("birthyear");
        let bio = options.getString("bio");
        let genshin = `https://some-random-api.com/canvas/namecard?avatar=${avatarUrl}&birthday=${
          encodeURIComponent(birthday) + birthmonth + birthyear
        }&username=${encodeURIComponent(
          user.username
        )}&description=${encodeURIComponent(bio)}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: genshin });
        await interaction.reply({
          content: `Sent the name card!`,
          ephemeral: true,
        });

        break;
      case "bisexual":
        let bi = `https://some-random-api.com/canvas/bisexual?avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: bi });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "blur":
        let blur = `https://some-random-api.com/canvas/blur?avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: blur });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "nobitches":
        let no = options.getString("no");
        let bitches = `https://some-random-api.com/canvas/nobitches?no=${encodeURIComponent(
          no
        )}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: bitches });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "wasted":
        let wasted = `https://some-random-api.com/canvas/wasted?avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: wasted });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "triggered":
        let triggered = `https://some-random-api.com/canvas/triggered?avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: triggered });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "jail":
        let jail = `https://some-random-api.com/canvas/jail?avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: jail });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "gay":
        let gay = `https://some-random-api.com/canvas/gay?avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: gay });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "comrade":
        let comrade = `https://some-random-api.com/canvas/comrade?&avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: comrade });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "passed":
        let passed = `https://some-random-api.com/canvas/passed?&avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: passed });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });

        break;
      case "lgbt":
        let lgbt = `https://some-random-api.com/canvas/lgbt?&avatar=${avatarUrl}`;

        await interaction.channel.sendTyping(),
          await interaction.channel.send({ content: lgbt });
        await interaction.reply({
          content: `Sent the image!`,
          ephemeral: true,
        });
    }
  },
};
