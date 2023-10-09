

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const testSchema = require('../../schemas.js/test');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dbtest')
    .setDescription('db test [dont use this command ]')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setDMPermission(false), 
      devOnly: true,
    async execute (interaction) {

        const data = await testSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id})

            if (!data) {
                testSchema.create({
                    GuildID: interaction.guild.id,
                    UserID: interaction.user.id
                })

            await interaction.reply({content: 'data created!', ephemeral: true})

            }

            if (data) {
                return interaction.reply({content: 'already have data!', ephemeral: true})
            }
        
    }
}