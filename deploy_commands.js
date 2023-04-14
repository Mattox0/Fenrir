const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');

module.exports = {
	async build() {
		const commands = [];
		const slashFiles = fs.readdirSync("./commands_slash").filter(file => !file.endsWith('.js'));
        for (const dossier of slashFiles) {
			const allFiles = fs.readdirSync(`./commands_slash/${dossier}`).filter(file => file.endsWith('.js'));
            for (const file of allFiles) {
				const command = require(`./commands_slash/${dossier}/${file}`); // if all -> autre array
                commands.push(command.data.toJSON());
            }
        }
		const command = require(`./werewolf/werewolf.js`);
		commands.push(command.data.toJSON());
		
		const localCommands = [];
		
		const localCommand = require('./commands_slash/games/werewolf.js')
		localCommands.push(localCommand.data.toJSON());


		const rest = new REST({ version: '9' }).setToken(config.token);

		await rest.put(Routes.applicationGuildCommands('784943061616427018','901980905579643001'), { body: localCommands })
			.then(() => console.log('--- Commandes LOCALES ont été chargés ✅ ---'))
			.catch(console.error);
		
		await rest.put(Routes.applicationCommands("784943061616427018"), { body: commands })
			.then(() => console.log("--- Commandes GLOBALES ont été chargés ✅ ---"))
			.catch(console.error);
	},
};



