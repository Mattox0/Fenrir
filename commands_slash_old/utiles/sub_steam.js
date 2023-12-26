const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam')
        .setDescription('Gere les modules steam')
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Recherche un jeu dans l\'API de steam || 50 résultats maximum')
                .addStringOption(option => option.setName('recherche').setDescription('Votre recherche').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('random')
                .setDescription('Choisis un jeu steam aléatoirement')),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        require(`./steam/${interaction.options.getSubcommand()}`).execute(interaction, db, date);
    }
}