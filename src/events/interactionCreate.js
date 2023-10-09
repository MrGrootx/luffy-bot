// const ms = require('ms');
const ms = require('ms')

const { Interaction,EmbedBuilder, time } = require("discord.js");
const { isUserPremium } = require('../events/premiumCodegen');
const cooldown = new Set()

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

     const { member} = interaction

        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return

        // cooldown Lines
        const cooldownData = `${interaction.user.id}/${interaction.commandName}`;
        if(client.cooldown.has(cooldownData)) {
            const time = ms(client.cooldown.get(cooldownData) - Date.now());

            return interaction.reply({ content: `**You are in Cooldown for ${time}**`, ephemeral: true})
        };
        interaction.setCooldown = (time) => {
            client.cooldown.set(cooldownData, Date.now() + time);
            setTimeout(() => client.cooldown.delete(cooldownData), time);
        };


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

        const developerID = process.env.DEVELOPER_ID
        if (command.devOnly && !developerID.includes(interaction.user.id)) {
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