const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'interactionCreate',
	async execute(interraction,client,Config,db) {
		tab = ['giveaways','giveaways_remove','poll','ticket_close','ticket_reopen','ticket_save','ticket_delete','ticket','like_profile','unlike_profile','select_help'];
		poll = ['poll1','poll2','poll3','poll4','poll5','poll6','poll7','poll8','poll8','poll9']
		tab.forEach(item => {
			if (interraction.customId) if (interraction.customId.split('-')[0] === item) {client.events.get(item).execute(interraction,client,Config,db);return};
		});
		poll.forEach(item => {
			if (interraction.customId) if (interraction.customId === item) {client.events.get('poll').execute(interraction,client,db);return};
		});
		if (!interraction.isCommand()) return;
		const command = client.slash_commands.get(interraction.commandName);

		if (!command) return;
		let date = new Date();
		try {
			await command.execute(interraction,client,date,Config,db);
		} catch (error) {
			console.error(error);
			const echec = new EmbedBuilder()
				.setColor('#2f3136')
				.setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
				.setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
			await interraction.reply({ embeds:[echec], ephemeral: true });
		}
	}
};