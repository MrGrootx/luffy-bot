const ms = require('ms');

const { Interaction,EmbedBuilder } = require("discord.js");
const { isUserPremium } = require('../events/premiumCodegen')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

     const { member} = interaction

        if (!interaction.isCommand()) return;


        const command = client.commands.get(interaction.commandName);
        if (!command) return
        /// premium command start
        const isPremium = await isUserPremium(member.id )
        const premiumEmbed = new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setAuthor({ name: "Premium only", iconURL: client.user.displayAvatarURL()})
        .setDescription(" Hold on Hold on This Command is Premium users Only")

        if(command.premiumOnly && !isPremium) {
            return interaction.reply({
                embeds: [premiumEmbed],
                ephemeral: true
            })
        }

        // developer interaction

        if (command.devOnly && interaction.user.id !== process.env.DEVELOPER_ID) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('NotQuiteBlack')
                        .setDescription(':warning: | This command is for Develepors only')
                ],
                ephemeral: true
            })
        }
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command', 
                ephemeral: true
            });
        } 

        
       

    },
    


};