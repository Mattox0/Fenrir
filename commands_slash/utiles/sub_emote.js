const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emote')
        .setDescription('Un système pour gérer vos emotes !')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Ajoute une emote au serveur')
                .addStringOption(option => option.setName('nom').setDescription('Le nouveau nom de votre emote').setRequired(true))
                .addStringOption(option => option.setName('emote').setDescription('L\'emote a ajouter').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Supprime une emote au serveur')
                .addStringOption(option => option.setName('emote').setDescription('L\'emote ou le nom de l\'emote a supprimer').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('image')
                .setDescription('Affiche les informations d\'une emote')
                .addStringOption(option => option.setName('emote').setDescription('L\'emote ou le nom de l\'emote').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription('Renomme une emote du serveur')
                .addStringOption(option => option.setName('nom').setDescription('Le nouveau nom de votre emote').setRequired(true))
                .addStringOption(option => option.setName('emote').setDescription('L\'emote ou le nom de l\'emote a renommer').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Liste toutes les emotes du serveur')),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        require(`./emote/${interaction.options.getSubcommand()}`).execute(interaction, date);
    }
}