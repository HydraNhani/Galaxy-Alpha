import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";

module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            description: "skips the song in the queue",
            category: "music"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 1) {
            const queue = client.queue.get(message.guild.id).queue;
            queue.shift();
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: queue,
                nowPlaying: client.queue.get(message.guild.id).nowPlaying
            });
            client.music.play(message, message.guild.me.voice.channel, client.queue.get(message.guild.id).queue[0].title, false);
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};