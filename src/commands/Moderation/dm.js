const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Make me DM a user")
    .addUserOption((option) =>
      option.setName("user")
      .setDescription("The user to DM")
      .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to DM")
        .setRequired(true)
    ),

  async execute(interaction) {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) 
    return await interaction.reply({
      content: "To use this command you need to have `Manage Messages` permission",
      ephemeral: true,
    })

    const { chennel, client, options } = interaction;

    const user = options.getMember("user");
    const message = options.getString("message");

    if (user.id === process.env.BOT_ID) {
      return await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
            .setColor('Red')
            .setDescription('You cant DM me')
          ]
        })
        .catch((err) => {});
    }
    user.send(message).catch(async (err) => {
      console.log(err);

      return await interaction
        .editReply({
          content: `Failed to send message, please try again`,
        })
        .catch((err) => {});
    });

    await interaction
      .reply({
        content: `**${message}** message sended **${user}**`,
      })
      .catch((err) => {
        interaction.reply({ content: `Failed to send message, please try again`})
      });

    await setTimeout(() => {
      interaction.deleteReply();
    }, 3500);
  },
};


/**  
 *Coded By : Mr Groot#9862
*/