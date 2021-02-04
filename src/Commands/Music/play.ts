import GalaxyAlpha from '@root/Client';
import Command from '@root/Command';
import { VoiceChannel } from 'discord.js';
import { videoFinder, playlistFinder } from "@commands/Music/Music";
import ytSearch from "yt-search";
import duration from "humanize-duration";

export default class PlayCommand extends Command {
    constructor() {
        super({
            name: "play",
            description: "plays an YouTube audio",
            usage: "play <YouTube link/keywords>",
            category: "music",
            guildOnly: true
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        const embed = client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🎧 Music Manager");
        const voiceChannel: VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(embed.setDescription('You need to be in a voice channel to use this command!'));
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('SPEAK')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('VIEW_CHANNEL')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!args.length) return message.channel.send(embed.setDescription("You need to send keywords or an valid YouTube link to let me play music!"));
        const videoResults = await (await playlistFinder(args.join(" ")) ? playlistFinder(args.join(" ")) : (await videoFinder(args.join(" ")) ? await videoFinder(args.join(" ")) : null));
        if (!videoResults) return message.channel.send(embed.setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 0 && client.queue.get(message.guild.id).nowPlaying) {
            if (voiceChannel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(embed.setDescription("You need to be in the same voice channel, where I am!"));
            if (videoResults.type == "list") {
                const playList = await ytSearch({ listId: videoResults.listId });
                playList.videos.forEach(video => addToQueue(video.videoId));
                return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Added the playlist with \`${playList.videos.length}\` videos to the queue!
                    
                    **<:youtube:786675436733857793> [${playList.title}](${playList.url})**
                    *uploaded by [${playList.author.name}](${playList.author.url})* on ${playList.date}`));
            } else {
                addToQueue(videoResults.videoId);
                const video = await ytSearch({ videoId: videoResults.videoId });
                return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Added the song to the queue!
                    
                    **<:youtube:786675436733857793> [${video.title}](${video.url})**
                    *uploaded by [${video.author.name}](${video.author.url}) on ${video.uploadDate} (${video.ago})*
                    
                    **Duration:** ${client.util.getDuration(video.duration.seconds * 1000)} (${duration(video.duration.seconds * 1000, {
                        units: ["h", "m", "s"],
                        round: true
                    })})
                    **Views:** ${video.views.toLocaleString()} views
                    **Genre:** ${client.util.toUpperCaseBeginning(video.genre)}`)
                    .setImage(video.image));
            };
        } else {
            if (videoResults.type == "list") {
                const playList = await ytSearch({ listId: videoResults.listId });
                message.channel.send(client.createEmbed()
                    .setTitle(`🎧 Music Manager`)
                    .setDescription(`**<:youtube:786675436733857793> [${playList.title}](${playList.url})**
                    *uploaded by [${playList.author.name}](${playList.author.url})*`));
                playList.videos.forEach(video => addToQueue(video.videoId));
                return client.music.play(message, voiceChannel, playList.videos[0].videoId, true, prefix, this.usage, true);
            } else {
                return client.music.play(message, voiceChannel, videoResults.videoId, true, prefix, this.usage, true);
            };
        };
        async function addToQueue(videoID: string) {
            if (!client.queue.has(message.guild.id)) client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: [],
                nowPlaying: false,
                dispatcher: null,
                voiceChannel: null,
                beginningToPlay: null,
                stopToPlay: null,
                multipleLoop: false,
                singleLoop: false,
                shuffle: false
            });
            await ytSearch({ videoId: videoID }, (err, video) => {
                if (err) return;
                if (!video) return;
                const queue = client.queue.get(message.guild.id).queue;
                if (client.queue.get(message.guild.id).queue.find(video => video.videoID == videoID)) return;
                queue.push({
                    title: video.title,
                    url: video.url,
                    requesterID: message.author.id,
                    duration: video.duration,
                    views: video.views,
                    image: video.image,
                    author: video.author,
                    videoID: videoID,
                    ago: video.ago,
                    uploadDate: video.uploadDate,
                    genre: video.genre
                });
                client.queue.set(message.guild.id, {
                    guildID: message.guild.id,
                    queue: queue,
                    nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                    dispatcher: client.queue.get(message.guild.id).dispatcher,
                    voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                    beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                    stopToPlay: null,
                    multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                    singleLoop: client.queue.get(message.guild.id).singleLoop,
                    shuffle: client.queue.get(message.guild.id).shuffle
                });
            });
        };
    };
};