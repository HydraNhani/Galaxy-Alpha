import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class FuseCommand extends Command {
    constructor(){
        super({
            name: "fuse",
            description: "fuse an other user",
            category: "fun",
            usage: "fuse <@User/User ID>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        if (!user) return client.createArgumentError(message, { title: "🔮 Fuse Manager", description: "You have to mention an user or provide an user ID to fuse with!" }, this.usage);
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.fuse(message.author.displayAvatarURL({ dynamic: false, format: "png" }), user.displayAvatarURL({ dynamic: false, format: "png" })), "delete.png"));
    };
};