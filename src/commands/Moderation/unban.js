const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('unban')
  .setDescription('unban the user')
  .addUserOption(option => option.setName('target').setDescription('The member you \'like to unban').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for unban the member').setRequired(false)),

  async execute (interaction, client) {

    const userId = interaction.options.getUser('target');
    // who can acess this command
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) 
    return await 
    interaction.reply({ 
        content: `To use This command you need **Ban Members** Permission`, 
        ephemeral: true})


    let reason = interaction.options.getString('reason') || ('No reason provided');

    if(!reason) reason = "no reason given";


    // send log
    const logsend = process.env.UN_BAN_LOG
    const logchannelsend = interaction.guild.channels.cache.get(logsend)

    const logembed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setDescription(` Action By : ${interaction.user} 
    \nAction On : ${userId} \n
    Reason : ${reason} \n
    Time : ${interaction.createdAt.toTimeString()} \n
    Date : ${interaction.createdAt.toDateString()}`)
    .setThumbnail(userId.displayAvatarURL())
    .setFooter({ text: 'UNBAN LOG'})

    await interaction.guild.bans.fetch().then(async bans => {
        if (bans.size == 0) return
        await interaction.deferReply({
            content: `There is no one to unban user... try **USER ID** who you want to unban`,
            ephemeral: true
        }).catch(err => {
            return;
        })

        let bannedID = bans.find(ban => ban.user.id == userId);
        if (!bannedID) return await interaction.reply({
            content: `The id you give is not banned from this server`,
            ephemeral: true
        })

        await interaction.guild.bans.remove(userId, reason).catch(err => {
            return interaction.reply({
                conten: `I cant unban this user`,
                ephemeral: true
            })
        })
    });

    const replyembed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setDescription(`${userId} has unbanned from this server`)

    await interaction.reply({ embeds: [replyembed], ephemeral: true}).catch(() => {
        return interaction.reply({
            content: `i cant able to find this user try **USER ID** who you want to unban`
        })
    })

    await logchannelsend.send({ embeds: [logembed], ephemeral: true }).catch(err => {
        return;
    })

  }
     
};



/**  
 *Coded By : Mr Groot#9862
*/