# import setup schema
1. const economySetup  = require('../../schemas.js/Eco-Setup')

# before your module.export
2. async function isEconomyEnabled(guildId) {
  const economyData = await economySetup.findOne({ GuildID: guildId });
  return economyData && economyData.DisEn;
}

# after the async execute
3.     const guildId = interaction.guild.id;
    // Check Economy System Enabled/Disabled for intract Guild
    if (!(await isEconomyEnabled(guildId))) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setColor('Red')
          .setDescription(`Economy System Not Enabled For this Server`)
        ]
      });
    }

