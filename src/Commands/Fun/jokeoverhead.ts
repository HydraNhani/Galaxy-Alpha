import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class JokeOverCommand extends Command {
    constructor(){
        super({
            name: "jokeoverhead",
            description: "shows a joke over your head",
            category: "fun",
            usage: "jokeoverhead [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.author;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.jokeOverHead(user.displayAvatarURL({ dynamic: false, format: "png" })), "delete.png"));
    };
};