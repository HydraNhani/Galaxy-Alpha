"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giveawayManager = void 0;
const giveaways_1 = __importDefault(require("@models/Giveaways/giveaways"));
exports.giveawayManager = "🎉 Giveaway Manager";
class GiveawayManager {
    constructor(client) {
        this.client = client;
    }
    ;
    async start(options, message, requirements) {
        let blackListedRole;
        let byPassRole;
        const guildSettings = await this.client.cache.getGuild(message.guild.id);
        if (guildSettings.giveawayBlacklistedRoleID && message.guild.roles.cache.has(guildSettings.giveawayBlacklistedRoleID))
            blackListedRole = message.guild.roles.cache.get(guildSettings.giveawayBlacklistedRoleID);
        if (guildSettings.giveawayByPassRoleID && message.guild.roles.cache.has(guildSettings.giveawayByPassRoleID))
            byPassRole = message.guild.roles.cache.get(guildSettings.giveawayByPassRoleID);
        const channel = this.client.guilds.cache.get(options.guildID).channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(options.channelID);
        const giveawayEmbed = this.client.createEmbed()
            .setTitle(options.prize)
            .setDescription(`${this.client.arrowEmoji} **React with 🎉 to enter!**\n**🏅 ${options.winners == 1 ? "Winner" : "Winners"}**: ${options.winners}\n${this.client.memberEmoji} **Hosted By**: ${options.hostedBy}\n`)
            .setTimestamp(new Date(Date.now() + options.duration))
            .setFooter(`Ends at`, this.client.user.displayAvatarURL({ dynamic: true }));
        let text = '';
        if (requirements.messages != 0)
            text += `${this.client.chatEmoji} You need to have \`${requirements.messages}\` messages!\n`;
        if (requirements.invites != 0)
            text += `📨 You need to have \`${requirements.invites}\` invites!\n`;
        if (requirements.level != 0)
            text += `🎚️ You need to be Level \`${requirements.level}\`!\n`;
        if (requirements.roles.length > 0)
            text += `🎭 You need to have ${requirements.roles.length == 1 ? "the role" : "one of the follwing roles"} ${requirements.roles.length == 1 ? `<@&${requirements.roles}>` : `: <@&${requirements.roles.join("> | <@&")}>`}!\n`;
        if (requirements.guildReq != 'none')
            text += `${this.client.protectedEmoji} You should be in **[${(await this.client.fetchInvite(requirements.guildReq)).guild.name}](${requirements.guildReq})**!\n`;
        if (requirements.messages != 0 || requirements.invites != 0 || requirements.level != 0 || requirements.roles.length > 0 || requirements.guildReq != 'none')
            giveawayEmbed.addField(`${this.client.warningInfoEmoji} Requirements:`, text);
        const msg = await channel.send(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY**   ${this.client.galaxyAlphaEmoji}`, giveawayEmbed);
        await msg.react("🎉");
        const Reactions = msg.createReactionCollector((reaction, user) => reaction.emoji.name == '🎉', { time: options.duration });
        const messagePing = await msg.channel.send(`${options.hostedBy}`);
        messagePing.delete({ timeout: 1 });
        message.channel.send(this.client.createGreenEmbed()
            .setTitle(exports.giveawayManager)
            .setDescription(`Successfully created a giveaway with the prize \`${options.prize}\` in ${channel}!`));
        Reactions.on('collect', async (reaction, user) => {
            if ((await this.client.cache.getGiveaway(msg.id)).hasEnded)
                Reactions.stop();
            if (user.bot)
                msg.reactions.cache.get("🎉").users.remove(user.id);
            const member = message.guild.members.cache.get(user.id);
            let userMessages = (await this.client.cache.getLevelandMessages(options.guildID, member.id)).messages;
            let userLevel = (await this.client.cache.getLevelandMessages(options.guildID, member.id)).level;
            let serverReq;
            if (requirements.guildReq != 'none')
                serverReq = (await this.client.fetchInvite(requirements.guildReq)).guild;
            let memberRolesHas = 0;
            if (requirements.roles.length != 0)
                for (const role of requirements.roles) {
                    const roles = member.roles.cache.map(role => `${role.id}`);
                    if (roles.includes(requirements.roles[role]))
                        memberRolesHas++;
                }
            ;
            if (byPassRole && member.roles.cache.has(byPassRole.id))
                member.send(this.client.createGreenEmbed()
                    .setTitle(exports.giveawayManager)
                    .setDescription(`Your giveaway entry has been confirmed!
                **[${options.prize}](${msg.url})** in ${channel} of **${msg.guild.name}**
                By reacting to any giveaways, which are created by ${this.client.user}, you agree to be DMed by the bot,
                whether you joined a giveaway or you won a giveaway!`));
            else {
                if (blackListedRole && member.roles.cache.has(blackListedRole.id) && member.id != message.author.id) {
                    msg.reactions.cache.get("🎉").users.remove(user.id);
                    member.send(this.client.createRedEmbed()
                        .setTitle(exports.giveawayManager)
                        .setDescription(`Your giveaway entry has been denied!
                        Your are blacklisted from joining any giveaways, which were created by ${this.client.user}, in **${msg.guild.name}**!`));
                }
                else if (requirements.roles.length != 0 && memberRolesHas == 0) {
                    msg.reactions.cache.get("🎉").users.remove(user.id);
                    member.send(this.client.createRedEmbed()
                        .setTitle(exports.giveawayManager)
                        .setDescription(`Your giveaway entry has beem denied!
                        You need one of the required roles to enter this giveaway!`));
                }
                else if (requirements.messages != 0 && requirements.messages > userMessages) {
                    msg.reactions.cache.get("🎉").users.remove(user.id);
                    member.send(this.client.createRedEmbed()
                        .setTitle(exports.giveawayManager)
                        .setDescription(`Your giveaway entry has been denied!
                        You need to send \`${requirements.messages - userMessages}\` messagse in **${msg.guild.name}** to enter this giveaway!`));
                }
                else if (requirements.level != 0 && requirements.level > userLevel) {
                    msg.reactions.cache.get("🎉").users.remove(user.id);
                    member.send(this.client.createRedEmbed()
                        .setTitle(exports.giveawayManager)
                        .setDescription(`Your giveaway entry has been denied!
                        You need to be Level \`${requirements.level}\` in **${msg.guild.name}** to enter this giveaway!
                        You are currently Level \`${userLevel}\`!`));
                }
                else if (requirements.invites != 0 && requirements.invites != 0) {
                    member.send(this.client.createGreenEmbed()
                        .setTitle(exports.giveawayManager)
                        .setDescription(`Your giveaway entry has been confirmed!
                        **[${options.prize}](${msg.url})** in ${channel} of **${msg.guild.name}**
                        By reacting to any giveaways, which are created by ${this.client.user}, you agree to be DMed by the bot,
                        whether you joined a giveaway or you won a giveaway!`));
                }
                else
                    member.send(this.client.createGreenEmbed()
                        .setTitle(exports.giveawayManager)
                        .setDescription(`Your giveaway entry has been confirmed!
                    **[${options.prize}](${msg.url})** in ${channel} of **${msg.guild.name}**
                    By reacting to any giveaways, which are created by ${this.client.user}, you agree to be DMed by the bot,
                    whether you joined a giveaway or you won a giveaway!`));
            }
            ;
        });
        this.client.cache.giveaways.set(msg.id, {
            prize: options.prize,
            duration: options.duration,
            channelID: options.channelID,
            guildID: options.guildID,
            endsOn: new Date(Date.now() + options.duration),
            startsOn: new Date(),
            messageID: msg.id,
            winners: options.winners,
            hostedBy: options.hostedBy,
            hasEnded: false
        });
        setTimeout(async () => {
            if (!(await this.client.cache.getGiveaway(msg.id))?.hasEnded) {
                Reactions.stop();
                await this.end(msg.id);
            }
            ;
        }, options.duration);
    }
    ;
    async end(messageIDOfGiveaway, msg, usage) {
        const giveaway = await this.client.cache.getGiveaway(messageIDOfGiveaway);
        if (!giveaway)
            return this.client.createArgumentError(msg, { title: exports.giveawayManager, description: `Cannot find the giveaway with the message ID \`${messageIDOfGiveaway}\`!` }, usage);
        let { messageID, channelID, prize, winners, hostedBy, hasEnded } = giveaway;
        if (hasEnded)
            return this.client.createArgumentError(msg, { title: exports.giveawayManager, description: "This giveaway has been already ended!" }, usage);
        const channel = this.client.channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(channelID);
        const message = await channel.messages.fetch(messageID);
        if (message) {
            const { embeds, reactions } = message;
            const reaction = reactions.cache.get('🎉');
            const users = await reaction.users.fetch();
            const entries = users.filter(user => !user.bot && channel.guild.members.cache.has(user.id)).array();
            if (embeds.length == 1) {
                const embed = embeds[0];
                const winner = this.getWinners(entries);
                let finalWinners;
                let finalWinnersEmbed;
                if (!winner) {
                    finalWinners = '**Nobody reacted!**';
                    finalWinnersEmbed = finalWinners;
                }
                else {
                    finalWinners = winner
                        .map(user => user.toString())
                        .join(', ');
                    finalWinnersEmbed = winner
                        .map((user) => user.toString())
                        .join('\n');
                }
                ;
                if (!winner) {
                    channel.send(this.client.createRedEmbed().setTitle(exports.giveawayManager).setDescription(`Nobody reacted to the giveaway!\n${message.url}`));
                    embed.setDescription(`**🏅 ${winners == 1 ? "Winner" : "Winners"}:** Nobody reacted!\n${this.client.memberEmoji} **Hosted By:** ${hostedBy}\n`);
                    embed.setFooter(`Ended at`, this.client.user.displayAvatarURL({ dynamic: true }));
                    embed.setColor("#818386");
                    await message.edit(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY ENDED**   ${this.client.galaxyAlphaEmoji}`, embed);
                }
                else {
                    this.DMWinner(winner, prize, message, channel);
                    channel.send(finalWinners).then(msg => msg.delete({ timeout: 1 }));
                    channel.send(this.client.createGreenEmbed()
                        .setTitle(exports.giveawayManager)
                        .setDescription(`Congratulations ${finalWinners}! You won the **${prize}**!\n${message.url}`)).then(async (giveawayMessage) => {
                        embed.setDescription(`**🏅 ${winners == 1 ? "Winner" : "Winners"}**:\n${finalWinnersEmbed}\n[or click me](${giveawayMessage.url})\n${this.client.memberEmoji} **Hosted By:** ${hostedBy}\n`);
                        embed.setFooter(`Ended at`, this.client.user.displayAvatarURL({ dynamic: true }));
                        embed.setColor("#818386");
                        await message.edit(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY ENDED**   ${this.client.galaxyAlphaEmoji}`, embed);
                    });
                }
                ;
                return await this.endGiveaway(messageID);
            }
            ;
        }
        else
            return this.client.createArgumentError(msg, { title: exports.giveawayManager, description: "Invalid message ID!" }, usage);
    }
    ;
    async fetch(messageID) {
        const giveaway = await giveaways_1.default.findOne({ messageID: messageID });
        if (!giveaway)
            return false;
        return giveaway;
    }
    ;
    async list(guildID) {
        const Giveaways = await giveaways_1.default.find({ guildID: guildID, hasEnded: false });
        if (Giveaways.length < 1)
            return false;
        const array = [];
        Giveaways.map(giveaway => array.push({
            hostedBy: giveaway.hostedBy,
            timeRemaining: giveaway.endsOn.getTime() - Date.now(),
            messageID: giveaway.messageID,
            prize: giveaway.prize,
            guildID: giveaway.guildID,
            winners: giveaway.winners,
            channel: `<#${giveaway.channelID}>`
        }));
        return array;
    }
    ;
    async reroll(messageID, message, usage) {
        const giveaway = await this.client.cache.getGiveaway(messageID);
        if (!giveaway)
            return this.client.createArgumentError(message, { title: exports.giveawayManager, description: `Cannot find the giveaway with the message ID \`${messageID}\`!` }, usage);
        const msg = await message.channel.messages.fetch(messageID);
        if (msg) {
            const ended = await giveaways_1.default.findOne({
                messageID: messageID
            });
            if (!ended)
                return false;
            const { reactions } = msg;
            const reaction = reactions.cache.get('🎉');
            if (!reaction)
                return this.client.createArgumentError(msg, { title: exports.giveawayManager, description: "This message is not a giveaway!" }, usage);
            const users = await reaction.users.fetch();
            const entries = users.filter(user => !user.bot && message.guild.members.cache.has(user.id)).array();
            const winner = this.getWinners(entries);
            let finalWinners;
            if (!winner) {
                finalWinners = '**Nobody reacted!**';
                return msg.channel.send(this.client.createEmbed()
                    .setTitle(exports.giveawayManager)
                    .setDescription(`Nobody reacted to the giveaway!\n${msg.url}`));
            }
            else {
                finalWinners = winner
                    .map(user => user.toString())
                    .join(', ');
                message.channel.send(finalWinners).then(msg => msg.delete({ timeout: 1 }));
                return msg.channel.send(this.client.createEmbed()
                    .setTitle(exports.giveawayManager)
                    .setDescription(`The new winner of this giveaways is ${winner}!`));
            }
            ;
        }
        else
            return this.client.createArgumentError(message, { title: exports.giveawayManager, description: "Invalid message ID!" }, usage);
    }
    ;
    DMWinner(winner, prize, message, channel) {
        for (const user of winner)
            user.send(this.client.createEmbed()
                .setTitle(exports.giveawayManager)
                .setDescription(`Congratulations! You won the **[${prize}](${message.url})** in ${channel} of **${message.guild.name}**!`));
    }
    ;
    getWinners(entries) {
        if (entries.length < 1)
            return false;
        const numbers = new Set();
        const array = [];
        let i = 0;
        const random = Math.floor(Math.random() * entries.length);
        const selected = entries[random];
        if (!numbers.has(random)) {
            array.push(selected);
            i++;
        }
        ;
        return array;
    }
    ;
    async endGiveaway(messageID) {
        this.client.cache.giveaways.delete(messageID);
        return await giveaways_1.default.findOneAndDelete({ messageID: messageID });
    }
    ;
}
exports.default = GiveawayManager;
;
//# sourceMappingURL=Giveaway.js.map