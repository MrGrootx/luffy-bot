const { DisTube } = require('distube');
const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js'); // Import the Discord module

const client =  require('../index') // Create a new Discord client

const player = new DisTube(client, {
    emitAddSongWhenCreatingQueue: false,
    emitNewSongOnly: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    searchSongs: 0,
    searchCooldown: 30,
});



player.on('playSong', (queue, song) => {

    // if (song.url.includes('open.spotify.com')) {
    //     queue.textChannel.send('This is a Spotify link: ' + song.url);
    // }

    const uploader = song.uploader.url
    ? `[${song.uploader.name}](${song.uploader.url})`
    : song.uploader.name;

    queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
            .setTitle(song.name).setURL(song.url)
            .setTimestamp()
            .setFooter({ text: `Now Playing`})
            .setColor('NotQuiteBlack')
            .setThumbnail(song.thumbnail || null)
            .setAuthor({ name: song.user.username, iconURL: song.user.displayAvatarURL()})
            .addFields(
                {
                    name: 'Duration',
                    value: song.formattedDuration.toString(), inline: true,
                },
                {
                    name: 'Channel',
                    value: queue.voiceChannel.toString(), inline: true,
                },
                {
                    name: 'Uploader',
                    value: uploader, inline: true,
                },
                {
                    name: 'Reqested By',
                    value: song.user.toString(), inline: true,
                }
            )
        ]
    });
});

player.on("addSong", (queue, song) => {
    queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
            .setTitle(song.name).setURL(song.url)
            .setThumbnail(song.thumbnail || null)
            .setAuthor({ name: song.user.username, iconURL: song.user.displayAvatarURL()})
            .setColor('NotQuiteBlack')
            .setFooter({ text: 'Added to queue'})
            .setTimestamp()
        ]
    })
});

player.on("finish", (queue) => {
    queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
            .setDescription('There are no more tracks')
            .setColor('NotQuiteBlack')
        ]
    });
});

player.on("error", ( channel , error) => {
    if (channel) channel.send("An error occured");
    else console.log(error);
});




module.exports = player;

/**
 * npm i @discordjs/opus distube libsodium-wrappers yt-search ytdl-core ffmpeg-static 
 */