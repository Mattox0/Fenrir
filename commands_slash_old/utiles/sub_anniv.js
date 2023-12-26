const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anniv')
        .setDescription('Un système d\'anniversaires pour votre serveur !')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Enregistre votre anniversaire')
                .addStringOption(option => option.setName('date').setDescription('La date d\'anniversaire ! Exemple : 26/09 (JJ/MM)').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Indique l\'anniversaire d\'une personne ou de soi')
                .addUserOption(option => option.setName('utilisateur').setDescription('L\'utilisateur visé ! Si vous ne mettez rien ce sera votre anniversaire').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Liste tous les anniversaires du serveur'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Supprime son anniversaire de la base de donnée')),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        require(`./anniv/${interaction.options.getSubcommand()}`).execute(interaction, date, db);
    }
}