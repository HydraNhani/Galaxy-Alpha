import Command, { CommandRunner, Categories } from '@root/Command';
import { MessageEmbed } from 'discord.js';

export default class HelpCommand extends Command {
    constructor() {
        super({
            name: 'help',
            description: "shows a list of all commands or shows infos about one command",
            category: "miscellaneous",
            aliases: ["info"],
            usage: "help or help <command name or alias>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const arrayOfCategories: Array<Categories> = [];
        client.categories.forEach(commands => {
            if (!arrayOfCategories.includes(commands[0].category) && commands[0].category != "developer" && commands[0].category != "private") arrayOfCategories.push(commands[0].category);
        });
        if (args[0]) {
            if (arrayOfCategories.includes((args[0].toLowerCase() as Categories))) {
                const commands = client.commands.filter(command => command.category == args[0].toLowerCase()).keyArray();
                return message.channel.send(client.createEmbed()
                    .setTitle(client.util.toUpperCaseBeginning(args[0]))
                    .setDescription(`In order to more infos about every single command,\nuse the command \`${prefix}help <command name>\`\n\n\`${commands.join("` `")}\``));
            } else {
                const command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
                if (!command || (command.developerOnly && !client.developers.includes(message.author.id)) || (command.ownerOnly && client.ownerID != message.author.id) || command.category == "private") return message.author.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("Command Manager")
                    .setDescription(`Cannot find the command \`${args[0].toLowerCase()}\` in the commands list!`));
                let text: string = "";
                let userPermissions: Array<string> = [];
                let clientPermissions: Array<string> = [];
                if (command.userPermissions) {
                    command.userPermissions.forEach(permission => {
                        userPermissions.push(client.permissionsShowCase[client.permissions.indexOf(permission)]);
                    });
                };
                if (command.clientPermissions) {
                    command.clientPermissions.forEach(permission => {
                        clientPermissions.push(client.permissionsShowCase[client.permissions.indexOf(permission)]);
                    });
                };
                if (command.name) text += `**Name:** ${command.name}\n`;
                if (command.category) text += `**Category:** ${command.category[0].toUpperCase() + command.category.slice(1).toLowerCase()}\n`
                if (command.description) text += `**Description:** ${command.description}\n`;
                if (command.aliases) text += `**Aliases:** ${command.aliases.join(", ")}\n`;
                if (command.cooldown) text += `**Cooldown:** ${client.ms(command.cooldown) / 1000 >= 60 ? `${Math.floor(client.ms(command.cooldown) / 1000 / 60)}m ${client.ms(command.cooldown) / 1000 - (Math.floor(client.ms(command.cooldown) / 1000 / 60) * 60)}s` : `${client.ms(command.cooldown) / 1000}s`}\n`;
                if (command.userPermissions) text += `**User ${command.userPermissions.length > 1 ? "Permissions" : "Permission"}:** \`${userPermissions.join("`, `")}\`\n`
                if (command.clientPermissions) text += `**Bot ${command.clientPermissions.length > 1 ? "Permissions" : "Permission"}**: \`${clientPermissions.join("`, `")}\`\n`;
                if (command.usage) text += `**Usage:** \`${prefix}${command.usage}\`\n`;
                if (command.dmOnly || command.guildOnly || command.nsfw || command.newsChannelOnly) text += `\n📝 **NOTES:**\n`
                if (command.guildOnly) text += `Works only in servers!\n`;
                if (command.dmOnly) text += `Works only in DM's\n`;
                if (command.nsfw) text += `Works only in NSFW channels or in DM's\n`;
                if (command.newsChannelOnly) text +=`Works only in Announcement channels\n`;
                return message.author.send(client.createEmbed()
                    .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`Command Info | ${command.name[0].toUpperCase() + command.name.slice(1).toLowerCase()}`)
                    .setDescription(text));
            };
        } else {
            const embedArray: Array<MessageEmbed> = [];
            let pages: number = arrayOfCategories.length + 1;
            const helpEmbed = client.createEmbed()
                .setTitle(`${client.profileEmoji} ${client.user.username}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`**${client.user.username}** is a bot to improve your server! 
                Better server management and much more utility and fun commands!
                Ticket system, giveaway and drop management, currency system, moderation commands, some game commands and music commands with basic stream quality!
                
                In order to use any commands of this bot, use the global prefix \`${client.globalPrefix}\`

                The current server prefix is ${client.globalPrefix == prefix ? "the same as the global prefix" : `${prefix}`}

                You can also suggest commands by doing \`${prefix}suggest command <description>\`

                To report any issues you can also use the suggestion command above!`)
                .addField("Categories", `\`${arrayOfCategories.map(category => `${client.util.toUpperCaseBeginning(category)}`).join("` `")}\``)
                .setFooter(`Page 1/${pages} • <> = REQUIRED | [] = OPTIONAL`, client.user.displayAvatarURL());
            embedArray.push(helpEmbed);
            for (let i = 0; i < arrayOfCategories.length; i++) {
                const embed = client.createEmbed().setTitle(client.util.toUpperCaseBeginning(arrayOfCategories[i])).setFooter(`Page ${i + 2}/${pages} • <> = REQUIRED | [] = OPTIONAL`);
                const commands = client.commands.filter(command => command.category == arrayOfCategories[i]).keyArray();
                embed.setDescription(`In order to more infos about every single command,\nuse the command \`${prefix}help <command name>\`\n\n\`${commands.join("` `")}\``);
                embedArray.push(embed);
            };
            let page: number = 0;
            return message.author.send(embedArray[0]).then(async msg => {
                if (message.channel.type != "dm") message.channel.send(client.createEmbed()
                    .setTitle("❓ Help")
                    .setDescription("You got an DM from me! Check it out!"));
                await msg.react('ℹ️');
                await msg.react('◀️');
                await msg.react('▶️');
                const Buttons = msg.createReactionCollector((reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == 'ℹ️') && user.id == message.author.id, { time: 24 * 60 * 60 * 1000 });
                Buttons.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name == '◀️') {
                        if (page == 0) {
                            await msg.edit(embedArray[embedArray.length - 1]);
                            page = embedArray.length - 1;
                        } else {
                            page--;
                            await msg.edit(embedArray[page]);
                        };
                    } else if (reaction.emoji.name == '▶️') {
                        if (page == embedArray.length - 1) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        } else {
                            page++;
                            await msg.edit(embedArray[page]);
                        };
                    } else {
                        if (page != 0) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        };
                    };
                });
            });
        };
    };
};