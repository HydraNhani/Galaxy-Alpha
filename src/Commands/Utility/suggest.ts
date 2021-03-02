import Command, { CommandRunner } from '@root/Command';
import { WebhookClient } from 'discord.js';

export default class SuggestCommand extends Command {
    constructor(){
        super({
            name: "suggest",
            category: "utility",
            description: "sends a suggestion to the staff of the server",
            guildOnly: true,
            usage: "suggest command <suggestion>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const suggestionManager: string = '📩 Suggestion Manager';
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (args[0].toLowerCase() == 'command') {
            const usage: string = `${prefix}suggest command <suggestion>`
            const suggestion: string = args.slice(1).join(" ");
            const suggestionChannel: WebhookClient = new WebhookClient("815967489493041202", "xpl7e2AIxTUI0hPhks5nH8G4Yta__iMCzxJhxCqb3vFO-QPWOyO2LWxVHOqpzLLjPZfK");
            if (!args[1]) return message.channel.send(client.createRedEmbed(true, usage)
                .setTitle(suggestionManager)
                .setDescription("You have to provide your suggestion! Please write your suggestion in English!"));
            const successEmbed = client.createGreenEmbed(true, usage)
                .setTitle(suggestionManager)
                .setDescription(`Your suggestion was successfully sent to the developers!\n**📝 Suggestion:** ${suggestion}`);
            const suggestionEmbed = client.createEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(suggestionManager)
                .setDescription(`${suggestion}
                
                **🗓️ Suggested on:** ${weekDays[message.createdAt.getUTCDay()]}, ${monthNames[message.createdAt.getUTCMonth()]} ${message.createdAt.getUTCDate()}, ${message.createdAt.getUTCFullYear()}, ${message.createdAt.getUTCHours()}:${message.createdAt.getUTCMinutes()}:${message.createdAt.getUTCSeconds()} UTC
                **${client.memberEmoji} Suggested from:** ${message.author} in **${message.guild.name}**`);
            return suggestionChannel.send(suggestionEmbed).then(msg => {
                return message.channel.send(successEmbed);
            });
        } else {
            
        };
    };
};