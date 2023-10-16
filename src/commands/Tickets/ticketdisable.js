const {
  SlashCommandBuilder,
} = require("discord.js");
const ticketSchema = require("../../schemas.js/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-ticket-system")
    .setDescription("Disable ticket system"),
  async execute(interaction, client) {
    try {
      const GuildID = interaction.guild.id;

      const data = await ticketSchema.findOne({ GuildID: GuildID });
      if (!data)
        return interaction.reply({ content: "Ticket panel is not setup",ephemeral: true });
        
        if(data) {
            await ticketSchema.findOneAndDelete({ GuildID: GuildID });
            interaction.reply({ content: `Ticket panel disabled
            To Enable the panel, use the \`/ticket-setup\` command`,
            ephemeral: true });
        }
    
      
    } catch (error) {
      console.log(error);
    }
  },
};
