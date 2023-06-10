const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Un système de profil de serveurs')
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('Limite le nombre d\'utilisateur dans le vocal privé')
				.addUserOption(option => option.setName('utilisateur').setDescription('L\'utilisateur dont tu veux voir le profil | Si rien -> ce sera le tien').setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('Modifie les informations de ton profil | Ne modifie que ce que tu renseigne')
				.addStringOption(option => option.setName('description').setDescription('La description de ton profil').setRequired(false))
				.addStringOption(option => option.setName('image').setDescription('Lien de ta photo de profil').setRequired(false))
				.addStringOption(option => option.setName('footer').setDescription('Ton pied de page').setRequired(false))
				.addStringOption(option => option.setName('couleur_hexa').setDescription('La couleur du cadre (en hexadécimal)').setRequired(false))
				.addStringOption(option => option.setName('pseudo').setDescription('Ton pseudo').setRequired(false))
				.addStringOption(option => option.setName('film').setDescription('Ton film préféré').setRequired(false))
				.addStringOption(option => option.setName('musique').setDescription('Ton style de musique').setRequired(false))
				.addStringOption(option => option.setName('repas').setDescription('Ton plat préféré').setRequired(false))
				.addStringOption(option => option.setName('adjectifs').setDescription('Trois adjectifs qui te correspondent').setRequired(false))),
	async execute(...params) {
		let interaction = params[0];
		let db = params[3];
		let date = params[2];
		require(`./profile/${interaction.options.getSubcommand()}`).execute(interaction, db, date);
	}
}