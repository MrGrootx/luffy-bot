const { SlashCommandBuilder , EmbedBuilder   } = require('discord.js')

const { NSFW } = require('nsfw-ts')
const nsfw = new NSFW()
module.exports = {
    data: new SlashCommandBuilder()
    .setName('nsfw')
    .setDescription('nsfw 18+')
    .setNSFW(true)
    .addSubcommand(command => command.setName('4k').setDescription('4K image.'))
    .addSubcommand(command => command.setName('ass').setDescription('ass image.'))
    .addSubcommand(command => command.setName('pussy').setDescription('pussy image.'))
    .addSubcommand(command => command.setName('boobs').setDescription('some boobs.'))
    .addSubcommand(command => command.setName('anal').setDescription('picture of anal.'))
    .addSubcommand(command => command.setName('thigh').setDescription(' picture of a thigh.'))
    .addSubcommand(command => command.setName('pgif').setDescription('porn gif.'))
    .addSubcommand(command => command.setName('hentai').setDescription(' hentai image.'))
    .addSubcommand(command => command.setName('hentaithigh').setDescription(' hentaithigh image.'))
    .addSubcommand(command => command.setName('gonewild').setDescription(' gonewild image.'))
    .addSubcommand(command => command.setName('hmidriff').setDescription(' hmidriff image.'))
    ,
    async execute (interaction, client) {
        // const image = await nsfw.pussy()


        // interaction.reply({ content: `${image}` })
        const sub = interaction.options.getSubcommand();
        switch (sub) {

            case '4k':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: ``, ephemeral: true});

            const kimage = await nsfw.fourk()
            const kembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(kimage)

            await interaction.editReply({ embeds: [kembed] })

            break;
            case 'ass':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const assimage = await nsfw.ass()
            const assembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(assimage)

            await interaction.editReply({ embeds: [assembed] })

            break;
            case 'pussy':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const pussyimage = await nsfw.pussy()
            const pussyembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(pussyimage)

            await interaction.editReply({ embeds: [pussyembed] })

            break;
            case 'boobs':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const boobsimage = await nsfw.boobs()
            const boobsembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(boobsimage)

            await interaction.editReply({ embeds: [boobsembed] })

            break;
            case 'anal':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const analimage = await nsfw.anal()
            const analembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(analimage)

            await interaction.editReply({ embeds: [analembed] })

            break;
            case 'thigh':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const thighimage = await nsfw.thigh()
            const thighembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(thighimage)

            await interaction.editReply({ embeds: [thighembed] })

            break;
            case 'pgif':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const pgifimage = await nsfw.pgif()
            const pgifembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(pgifimage)

            await interaction.editReply({ embeds: [pgifembed] })

            break;
            case 'hentai':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const hentaiimage = await nsfw.hentai()
            const hentaiembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(hentaiimage)

            await interaction.editReply({ embeds: [hentaiembed] })


            break;
            case 'hentaithigh':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            const hentaithighimage = await nsfw.hentaithigh()
            const hentaithighembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(hentaithighimage)

            await interaction.editReply({ embeds: [hentaithighembed] })

            break;
            case 'gonewild':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            
            const gonewildimage = await nsfw.gonewild()
            const gonewildembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(gonewildimage)

            await interaction.editReply({ embeds: [gonewildembed] })


            break;
            case 'hmidriff':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You cant execute this command here`, ephemeral: true});

            
            const hmidriffimage = await nsfw.hmidriff()
            const hmidriffembed = new EmbedBuilder()

            .setColor('NotQuiteBlack')
            .setImage(hmidriffimage)

            await interaction.editReply({ embeds: [hmidriffembed] })


        }   
    }
}