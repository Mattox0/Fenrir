const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vocal')
        .setDescription('Un système de vocaux privées !')
        .addSubcommand(subcommand =>
            subcommand
                .setName('limit')
                .setDescription('Limite le nombre d\'utilisateur dans le vocal privé')
                .addIntegerOption(option => option.setName('nombre').setDescription('Le nombre de membres maximum').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription('Renomme le salon')
                .addStringOption(option => option.setName('name').setDescription('Le nom du salon').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('private')
                .setDescription('Change le salon en privée ou en public | Le salon est en public par défaut')
                .addBooleanOption(option => option.setName('private').setDescription('True pour privée | False pour false').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Donne les permissions à un utilisateur à un salon | Pour qu\'il puisse gérer ou rejoindre')
                .addUserOption(option => option.setName('utilisateur').setDescription('L\'utilisateur en question').setRequired(true))),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        require(`./vocal/${interaction.options.getSubcommand()}`).execute(interaction, db, date);
    }
}