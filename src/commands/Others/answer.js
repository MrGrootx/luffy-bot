const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("answer")
    .setDescription("Answer to a message")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => option
        .setName("message-id")
        .setDescription("the message id")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("text")
        .setDescription("your text")
        .setRequired(true)
    ),


    async execute (interaction, client) {
        const msgid = interaction.options.getString("message-id");
        const content = interaction.options.getString("text");
        // const boolean = interaction.options.getBoolean("embed")


        if (msgid.startsWith("http")) {
            return await interaction.reply({
               content: "You can only use the message id",
               ephemeral: true
            })
        }

        await interaction.reply({
            content: `Answered to https://ptb.discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${msgid} \n **Your Message**: ${content}`,
            ephemeral: true
        })

        if (content) {
            await  client.channels.cache.get(interaction.channel.id).messages.fetch(msgid).then(message => message.reply({content: `${content}`})).catch(() => {
                return interaction.reply({ content: "The message ID is not found", ephemeral: true})
            })
            
        } 
    }
}