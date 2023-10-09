const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embed-creator')
    .setDescription('create you own embed')
	.addStringOption(option => option.setName('title').setDescription('Embed title').setRequired(true))
	.addStringOption(option => option.setName('description').setDescription('Embded description').setRequired(true))
    .addStringOption(option => option.setName('url').setDescription('title url').setRequired(false))
	.addStringOption(option => option.setName('image').setDescription('Embed image').setRequired(false))
	.addStringOption(option => option.setName('thumbnail').setDescription('Embed Thumbnail').setRequired(false))
	.addStringOption(option => option.setName('field-name').setDescription('Embed Field name').setRequired(false))
	.addStringOption(option => option.setName('field-value').setDescription('Field value').setRequired(false))
	.addStringOption(option => option.setName('footer').setDescription('Footer').setRequired(false))
    .addStringOption(option => option.setName('footer-icon').setDescription('set footer image').setRequired(false))
    .addStringOption(option => option.setName('author').setDescription('set author').setRequired(false))
    .addStringOption(option => option.setName('author-icon').setDescription('set author image').setRequired(false))
    .addStringOption(option => option
        .setName('color')
        .setDescription('set color for embed')
        .setRequired(false)
        .addChoices(
            { name: "Aqua", value: "#00FFFF" },
            { name: "Blurple", value: "#7289DA" },
            { name: "Fuchsia", value: "#FF00FF" },
            { name: "Gold", value: "#FFD700" },
            { name: "Green", value: "#008000" },
            { name: "Grey", value: "#808080" },
            { name: "Greyple", value: "#7D7F9A" },
            { name: "Light-grey", value: "#D3D3D3" },
            { name: "Luminos-vivid-pink", value: "#FF007F" },
            { name: "Navy", value: "#000080" },
            { name: "Not-quite-black", value: "#232323" },
            { name: "Orange", value: "#FFA500" },
            { name: "Purple", value: "#800080" },
            { name: "Red", value: "#FF0000" },
            { name: "White", value: "#FFFFFF" },
            { name: "Yellow", value: "#FFFF00" },
            { name: "Blue", value: "#0000FF" },
        )),  

    async execute (interaction) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEvents)) 
            return await interaction.reply({ content: "To user this command you need to have **ManageEvents** Permissions", ephemeral: true })

        const { options } = interaction;

        const title = options.getString('title');
        const url = options.getString('url');
        const description = options.getString('description');
        const color = options.getString('color') || "#232323";
        const image = options.getString('image');
        const thumbnail = options.getString('thumbnail');
        const fieldn = options.getString('field-name') || '  ';
        const fieldv = options.getString('field-value') || ' ';
        const footer = options.getString('footer') || ' ';
        const footeticon = options.getString('footer-icon') || `${interaction.member.displayAvatarURL({ dynamic: true })}`;
        const author = options.getString('author') || `${interaction.member.displayName}`;
        const authoricon = options.getString('author-icon') || `${interaction.member.displayAvatarURL({ dynamic: true })}`;

        if (image) {
            if (!image.startsWith('http')) return await interaction.reply({ content: "Use another image", ephemeral: true });
        }

        if (thumbnail) {
            if (!thumbnail.startsWith('http')) return await interaction.reply({ content: "Try with another thumbnail", ephemeral: true });
        }
        

        const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(url)
        .setDescription(description)
        .setColor(color)
        .setAuthor({ name: `${author}`, iconURL: `${authoricon}` })
        .setImage(image)
        .setThumbnail(thumbnail)
        .setTimestamp()
        .addFields({ name: `${fieldn}`, value: `${fieldv}` })
        .setFooter({ text: `${footer}`, iconURL: `${footeticon}` })

        const replyembed = new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setDescription(`Your embed has been created`)

        await interaction.reply({ embeds: [replyembed], ephemeral: true });
        await interaction.channel.send({ embeds: [embed] });
    }
}

/**  
 *Coded By : Mr Groot#9862
*/