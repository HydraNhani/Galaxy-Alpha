import Command, { CommandRunner } from "@root/Command";
import { ReactionCollector } from "discord.js";
import duration from "humanize-duration";
import canvacord from "canvacord";

export default class MusicPanelCommand extends Command {
    constructor() {
        super({
            name: "panel",
            description: "sends a music panel to control the music",
            guildOnly: true,
            category: "music",
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 0) {
            if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            let queue = client.queue.get(message.guild.id).queue;
            let song = 0;
            const panel = canvacord.Spotify();
            const msg = await message.channel.send(client.createEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`**<:youtube:786675436733857793> [${queue[0].title}](${queue[0].url})**
                *uploaded by [${queue[0].author.name}](${queue[0].author.url}) on ${queue[0].uploadDate} (${queue[0].ago})*
                
                **Duration:** ${client.util.getDuration(queue[0].duration.seconds * 1000)} (${duration(queue[0].duration.seconds * 1000, {
                    units: ["h", "m", "s"],
                    round: true
                })})
                **Views:** ${queue[0].views.toLocaleString()} views
                **Genre:** ${client.util.toUpperCaseBeginning(queue[0].genre)}
                
                ⏮️ ▶️ ⏭️`)
                .setImage(queue[0].image));
            client.queue.set(message.guild.id, {
                beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                dispatcher: client.queue.get(message.guild.id).dispatcher,
                guildID: message.guild.id,
                multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                panel: msg,
                queue: client.queue.get(message.guild.id).queue,
                shuffle: client.queue.get(message.guild.id).shuffle,
                singleLoop: client.queue.get(message.guild.id).singleLoop,
                stopToPlay: client.queue.get(message.guild.id).stopToPlay,
                voiceChannel: client.queue.get(message.guild.id).voiceChannel
            });
            const reactionArray: Array<string> = ["⏮️", "⏯️", "⏭️", "🔁", "🔂"];
            reactionArray.forEach(async reaction => await msg.react(reaction));
            const Buttons: ReactionCollector = msg.createReactionCollector((reaction, user) => !user.bot && reactionArray.includes(reaction.emoji.name));
            Buttons.on("collect", (reaction, user) => {
                const serverQueue = client.queue.get(message.guild.id);
                if (reaction.emoji.name == "⏮️") {
                    if (song == 0) song = queue.length - 1;
                    else song--;
                    if (client.queue.get(message.guild.id).shuffle) queue = client.music.shuffle(queue);
                    client.music.play(message, message.member.voice.channel, queue[song].videoID, false, prefix, null, false, true);
                    msg.edit(msg.embeds[0]
                        .setDescription(`**<:youtube:786675436733857793> [${queue[song].title}](${queue[song].url})**
                            *uploaded by [${queue[song].author.name}](${queue[song].author.url}) on ${queue[song].uploadDate} (${queue[song].ago})*
                            
                            **Duration:** ${client.util.getDuration(queue[song].duration.seconds * 1000)} (${duration(queue[song].duration.seconds * 1000, {
                            units: ["h", "m", "s"],
                            round: true
                        })})
                            **Views:** ${queue[song].views.toLocaleString()} views
                            **Genre:** ${client.util.toUpperCaseBeginning(queue[song].genre)}
                            
                            ⏮️ ▶️ ⏭️`)
                        .setImage(queue[song].image));
                } else if (reaction.emoji.name == "⏭️") {
                    if (song == queue.length - 1) song = 0;
                    else song++;
                    if (client.queue.get(message.guild.id).shuffle) queue = client.music.shuffle(queue);
                    client.music.play(message, message.member.voice.channel, queue[song].videoID, false, prefix, null, false, true);
                    msg.edit(msg.embeds[0]
                        .setDescription(`**<:youtube:786675436733857793> [${queue[song].title}](${queue[song].url})**
                            *uploaded by [${queue[song].author.name}](${queue[song].author.url}) on ${queue[song].uploadDate} (${queue[song].ago})*
                            
                            **Duration:** ${client.util.getDuration(queue[song].duration.seconds * 1000)} (${duration(queue[song].duration.seconds * 1000, {
                            units: ["h", "m", "s"],
                            round: true
                        })})
                            **Views:** ${queue[song].views.toLocaleString()} views
                            **Genre:** ${client.util.toUpperCaseBeginning(queue[song].genre)}
                            
                            ⏮️ ▶️ ⏭️`)
                        .setImage(queue[song].image));
                } else if (reaction.emoji.name == "⏯️") {
                    if (client.queue.get(message.guild.id).nowPlaying) {
                        client.music.stop(client.queue.get(message.guild.id).dispatcher);
                        client.queue.set(message.guild.id, {
                            ...serverQueue,
                            nowPlaying: false,
                            stopToPlay: new Date()
                        });
                        msg.edit(msg.embeds[0].setDescription(msg.embeds[0].description.replace(/⏮️ ▶️ ⏭️/g, "⏮️ ⏸️ ⏭️")));
                    } else {
                        client.music.resume(client.queue.get(message.guild.id).dispatcher);
                        const timeUsed = client.queue.get(message.guild.id).stopToPlay.getTime() - client.queue.get(message.guild.id).beginningToPlay.getTime();
                        client.queue.set(message.guild.id, {
                            ...serverQueue,
                            nowPlaying: true,
                            beginningToPlay: new Date(Date.now() - timeUsed),
                            stopToPlay: null
                        });
                        msg.edit(msg.embeds[0].setDescription(msg.embeds[0].description.replace(/⏮️ ⏸️ ⏭️/g, "⏮️ ▶️ ⏭️")));
                    };
                } else if (reaction.emoji.name == "🔁" && queue.length > 1) {
                    client.queue.set(message.guild.id, {
                        ...serverQueue,
                        multipleLoop: true,
                        singleLoop: false
                    });
                } else if (reaction.emoji.name == "🔂") {
                    client.queue.set(message.guild.id, {
                        ...serverQueue,
                        multipleLoop: false,
                        shuffle: false,
                        singleLoop: true
                    });
                };
                msg.reactions.cache.get(reaction.emoji.name).users.remove(user.id);
            });
            Buttons.on("end", (collected, reason) => {
                Buttons.stop();
                const serverQueue = client.queue.get(message.guild.id);
                return client.queue.set(message.guild.id, {
                    ...serverQueue,
                    panel: null
                });
            });
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};