const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder , PermissionFlagsBits, PermissionsBitField } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('timeout the member')
        .addUserOption(option => option.setName('target').setDescription('The member you \'like to timeout')
        .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("time")
            .setDescription("The amount of minutes to timeout a member for.")
            .setRequired(true)
            )
        .addStringOption(option => option.setName('reason').setDescription('The reason for timeout the member')
        ),
    async execute(interaction) {

        // who can access this command
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: `To use this command you need to have **Manage Roles** Permissions`, ephemeral: true})

       const user = interaction.options.getUser('target');
       const reason = interaction.options.getString('reason') || 'No reason provided';
       const time = interaction.options.getInteger('time') || 'No time provided';
       const member = await interaction.guild.members
       .fetch(user.id)
       .catch(console.error);

       if(!reason) reason = "No reason provided";


       if(!member) return await interaction.reply({ content: `User Not Found`, ephemeral: true}).catch(console.error)

       


       // timeout youself
       if (member, member.id == interaction.user.id) {
           return await interaction.reply({ content: "You can't timeout yourself!", ephemeral: true});
       }
   
       // server owner
       if (member, member.id == interaction.guild.ownerId) {
           return await interaction.reply({ content: "You can't timeout the server owner!", ephemeral: true});
       }
       // timeout higher command
       if (member) {
           if (member.roles.highest.position >= interaction.member.roles.highest.position) {
               return await interaction.reply({ content:`You cannot timeout because they have a higher/same role!`,
               ephemeral: true});
           }
       }



    await member.timeout(time * 60 * 1000, reason).catch(console.error);

    const logsend = process.env.TIMEOUT_LOG
    const logchannelsend = interaction.guild.channels.cache.get(logsend)

    const logembed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setDescription(` Action By : ${interaction.user} 
    \nAction On : ${user} \n
    Reason : ${reason} \n
    Time : ${interaction.createdAt.toTimeString()} \n
    Date : ${interaction.createdAt.toDateString()}`)
    .setThumbnail(user.displayAvatarURL())
    .setFooter({ text: 'TIMEOUT LOG'})

    await logchannelsend.send({ embeds: [logembed] })


    const timeoutembed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setDescription(`Timedout ${user.tag} sucessfully`)

    await interaction.reply({ embeds: [timeoutembed], ephemeral: true }).catch(() => {
        return;
    })

 
    },
};


/**  
 *Coded By : Mr Groot#9862
*/