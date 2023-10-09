const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverstatus')
    .setDescription('Shows the amount of members in the server'),

    async execute (interaction, client) {
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.guild.name}`)
        .addFields([
            {
                name: '> Total Count',
                value: `${interaction.guild.memberCount}` , inline: true,
            },
            {
                name: '> Bots',
                value: `${interaction.guild.members.cache.filter(member => member.user.bot).size}` , inline: true,
            },
            {
                name: "> Humans",
                value : `${interaction.guild.members.cache.filter(member => !member.user.bot).size}` , inline: true,
            },
            {
                name: '> Online',
                value: `${interaction.guild.members.cache.filter(member => member.presence && member.presence.status === 'online').size}` ,inline: true,
            },
            {
                name: '> Idle',
                value: `${interaction.guild.members.cache.filter(member => member.presence && member.presence.status === 'idle').size}` , inline: true,
            },
            {
                name: '> DND',
                value: `${interaction.guild.members.cache.filter(member => member.presence && member.presence.status === 'dnd').size}` , inline: true,
            },
            {
                name: '> Offline',
                value: `${interaction.guild.members.cache.filter(member => !member.presence || member.presence.status === 'offline').size}` , inline: true,
            },
            {
                name: '> Verified',
                value: `${interaction.guild.members.cache.filter(member => member.user.verified).size}` , inline: true,
            },
            {
                name: '> Server Boosters',
                value: `${interaction.guild.premiumSubscriptionCount}` , inline: true,
            }
             
        ])
        .setColor('NotQuiteBlack')
        .setThumbnail(client.user.displayAvatarURL({size:64}))
        .setFooter({text: ` Dev By : Mr Groot#9862` , iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        await interaction.reply({ embeds: [embed]})
    }
}

/** 
 * 
 * Coded By : Mr Groot#9862
 * 
*/