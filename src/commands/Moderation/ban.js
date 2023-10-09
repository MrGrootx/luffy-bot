const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bans the member')
  .addUserOption(option => option.setName('target').setDescription('The member you \'like to ban').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for banning the member').setRequired(true)),

  async execute (interaction, client) {

    const user = interaction.options.getUser('target');
    const id = user.id;
    const userBan = client.users.cache.get(user.id);

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: `To use This command you need **Ban Members** Permission`, ephemeral: true});

    if (interaction.member.id === id) 
    return await interaction.reply({ 
        content: `You can't ban yourself`, 
        ephemeral: true});

    let reason = interaction.options.getString('reason') || ('No reason provided');

    if (!reason) reason = "no reason given";

    const logsend = process.env.BAN_LOG
    const logchannelsend = interaction.guild.channels.cache.get(logsend)

    const logembed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setDescription(` Action By : ${interaction.user} 
    \nAction On : ${user} \n
    Reason : ${reason} \n
    Time : ${interaction.createdAt.toTimeString()} \n
    Date : ${interaction.createdAt.toDateString()}`)
    .setThumbnail(user.displayAvatarURL())
    .setFooter({ text: 'BAN LOG'})

    

    const banembed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setDescription(`Banned ${user.tag} sucessfully`)

   


    await interaction.guild.bans.create(userBan.id,  {reason}).catch(err => {
        return interaction.reply({ content: `I can't ban this user`, ephemeral: true});
    
    })

 

    await interaction.reply({ embeds: [banembed], ephemeral: true }).catch(() => {
        return;
    })

    await logchannelsend.send({ embeds: [logembed] }).catch(err => {
        return;
    })
  }
  
    
};



/**  
 *Coded By : Mr Groot#9862
*/