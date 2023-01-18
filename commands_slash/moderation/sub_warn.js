const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Système d\'avertissements')
        .addSubcommandGroup(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Affiche les avertissements')
                .addSubcommand(subcommand => 
                    subcommand
                    .setName('user')
                    .setDescription('Affiche les avertissements d\'un utilisateur')
                    .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif').setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand
                    .setName('all')
                    .setDescription('Affiche tous les avertissements du serveur')))
        .addSubcommandGroup(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Efface les avertissements')
                .addSubcommand(subcommand =>
                    subcommand
                    .setName('all')
                    .setDescription('Efface tous les avertissements du serveur'))
                .addSubcommand(subcommand =>
                    subcommand
                    .setName('user')
                    .setDescription('Affiche tous les avertissements d\'un utilisateur')
                    .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif').setRequired(true))))
        .addSubcommandGroup(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Avertis ou retire un warn d\'un utilisateur')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription('Avertis un utilisateur')
                        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif').setRequired(true))
                        .addStringOption(option => option.setName('raison').setDescription('La raison de l\'avertissement').setRequired(false)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription('Retire un warn d\'un utilisateur')
                        .addStringOption(option => option.setName('id').setDescription('l\'ID du warn à retirer').setRequired(true)))),             
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        require(`./warn/${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`).execute(interaction, date, db);
    }
}