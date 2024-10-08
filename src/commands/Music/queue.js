const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { paginate } = require("@not_i9/paginate");
const player = require("../../events/Musicplayer.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("List all songs in the queue")
    .setDMPermission(false),

  async execute(interaction, client) {
    const { guild, member } = interaction;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: `You must be in a voice channel to use this command`,
      });
    }

    if (!member.voice.channel == guild.members.me.voice.channel) {
      return interaction.reply({
        content: `Please Join <#${guild.members.me.voice.channelId}>`,
        ephemeral: true,
      });
    }

    try {
      const queue = player.getQueue(guild.id);

      if (!queue || !queue.songs) {
        return interaction.reply({
          content: `There is nothing playing`,
          ephemeral: true,
        });
      }

      const songs = queue.songs;
      const guildName =
        guild.name.length > 30 ? `${guild.name.slice(0, 30)}....` : guild.name;

      const embeds = [];
      let embedDesc = "";

      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const index = i + 1;

        if (index % 5 === 0 || i === songs.length - 1) {
          embedDesc += `**${index}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\`\n`;

          const embed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setAuthor({
              name: member.user.username,
              iconURL: member.displayAvatarURL(),
            })
            .setTitle(`Queue for ${guildName}`)
            .setDescription(embedDesc);
          embeds.push(embed);
          embedDesc = "";
        } else {
          embedDesc += `${index}. [${song.name}](${song.url})  \`${song.formattedDuration}\`\n`;
        }
      }

      await paginate(interaction, embeds, {
        buttons: {
          next: { text: "Next page" },
          previous: { text: "Previous page" },
          start: { text: "Last Page" },
        },
      });
    } catch (error) {
      throw error;
    }
  },

};
