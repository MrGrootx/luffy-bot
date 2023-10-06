const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Avatar")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    // const targetId  = interaction.user;

    const embed = new EmbedBuilder()
      .setDescription(`Avatar [Download](${interaction.targetUser.displayAvatarURL({dynamic: true, size: 512})})`)
      .setImage(interaction.targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor('NotQuiteBlack')
      

    interaction.reply({ embeds: [embed] });
  },
};
