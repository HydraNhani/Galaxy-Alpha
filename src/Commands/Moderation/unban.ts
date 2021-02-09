import Command, { CommandRunner } from "@root/Command";
import { User } from "discord.js";

export default class UnbanCommand extends Command {
    constructor() {
        super({
            name: "unban",
            description: "unbans a member of the server",
            category: "moderation",
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
            usage: "unban <@User/User ID>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let member: User;
        if (message.mentions.users.first() && (await message.guild.fetchBans()).has(message.mentions.users.first().id)) member = await client.users.fetch(message.mentions.users.first().id);
        if (args[0] && (await message.guild.fetchBans()).has(args[0])) member = await client.users.fetch(args[0]);
        if (!member) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You have to mention an user or provide an user ID!"));
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You cannot unban yourself!"));
        return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription(`Do you really want to ban ${member}?\n\nYou have 10s to react!`)).then(async msg => {
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 10000, max: 1 });
            YesOrNo.on('collect', (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    msg.reactions.cache.get(client.yesEmojiID).users.remove(message.author.id);
                    message.guild.members.unban(member.id).then(() => {
                        return message.channel.send(client.createGreenEmbed()
                            .setTitle("🔨 Ban Manager")
                            .setDescription(`🔨 ${member} was unbanned by ${message.author}!`));
                    });
                } else {
                    msg.reactions.cache.get(client.noEmojiID).users.remove(message.author.id);
                    return msg.channel.send(client.createRedEmbed().setTitle("🔨 Ban Manager").setDescription("Unban cancelled!"));
                };
            });
            YesOrNo.on('end', collected => {
                if (collected.size == 0) {
                    return msg.channel.send(client.createRedEmbed().setTitle("🔨 Ban Manager").setDescription("Unban cancelled!"));
                };
            });
        });
    };
};