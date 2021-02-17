import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';
import { Profile } from "@models/profile";

export default class BalanceCommand extends Command {
	constructor() {
		super({
			name: "balance",
			aliases: ["bal"],
			description: "shows the current balance of an user",
			category: "currency",
			usage: "balance [@User/User ID]"
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		let user: User = message.author;
		if (message.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
		if (args[0] && client.users.cache.filter(user => !user.bot).has(args[0])) user = client.users.cache.get(args[0]);
		if (!client.cache.currency.has(message.author.id)) client.cache.getCurrency(message.author.id);
		const authorProfile = await client.cache.getCurrency(message.author.id);
		client.cache.currency.set(message.author.id, ({
			...authorProfile,
			messageCount: authorProfile.messageCount + 1
		} as Profile));
		const userProfile = await client.cache.getCurrency(user.id);
		return message.channel.send(client.createEmbed()
			.setAuthor(`💰 ${user.username}'s Balance`, user.displayAvatarURL())
			.setThumbnail(user.displayAvatarURL())
			.setDescription(`**Wallet:** \`${userProfile.wallet.toLocaleString()}\`$\n**Bank:** \`${userProfile.bank.toLocaleString()}\`$`));
	};
};