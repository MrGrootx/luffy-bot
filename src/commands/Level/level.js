const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    SlashCommandBuilder,
  } = require('discord.js');
  const canvacord = require('canvacord');
  const calculateLevelXp = require('../../events/calculateLevelXp');
  const Level = require('../../schemas.js/Level');
  
  module.exports = {
    data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('show someone levels')
    .addUserOption(option => option.setName('user').setDescription('user to check').setRequired(false)),

    async execute (interaction) {

        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
          }
      
          await interaction.deferReply();
      
          const mentionedUserId = interaction.options.get('user')?.value;
          const targetUserId = mentionedUserId || interaction.member.id;
          const targetUserObj = await interaction.guild.members.fetch(targetUserId);
      
          const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
          });
      
          if (!fetchedLevel) {
            interaction.editReply(
              mentionedUserId
                ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
                : "You don't have any levels yet. Chat a little more and try again."
            );
            return;
          }
      
          let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
            '-_id userId level xp'
          );
      
          allLevels.sort((a, b) => {
            if (a.level === b.level) {
              return b.xp - a.xp;
            } else {
              return b.level - a.level;
            }
          });
      
          let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
      
          const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setLevelColor('#FFFF')
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setStatus(targetUserId.presence?.status || 'offline')
            .setProgressBarTrack('#3f7b40', 'COLOR')
            .setProgressBar('#0cf310', 'COLOR')
            .setUsername(targetUserObj.user.username)
            .setDiscriminator(targetUserObj.user.discriminator)
            .setBackground('IMAGE', 'https://media.discordapp.net/attachments/1147012197948604456/1159739660373852182/image.png?ex=65321eb9&is=651fa9b9&hm=511bc130e2c9a26d062afd9b5a6bd681acd7ea948cf201cd95a6ebccb731d34e&=')
      
          const data = await rank.build();
          const attachment = new AttachmentBuilder(data);
          interaction.editReply({ files: [attachment] });


    }
  };
  