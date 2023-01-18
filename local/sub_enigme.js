const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enigme')
        .setDescription('Un système d\'enigme !')
        .addSubcommand(subcommand =>
            subcommand
                .setName('1')
                .setDescription('Réponds à l\'enigme numéro 1')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('2')
                .setDescription('Réponds à l\'enigme numéro 2')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('3')
                .setDescription('Réponds à l\'enigme numéro 3')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('4')
                .setDescription('Réponds à l\'enigme numéro 4')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('5')
                .setDescription('Réponds à l\'enigme numéro 5')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('6')
                .setDescription('Réponds à l\'enigme numéro 6')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('7')
                .setDescription('Réponds à l\'enigme numéro 7')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('8')
                .setDescription('Réponds à l\'enigme numéro 8')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('9')
                .setDescription('Réponds à l\'enigme numéro 9')
                .addStringOption(option => option.setName('réponse').setDescription('Votre réponse').setRequired(true))),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        require(`./enigmes/${interaction.options.getSubcommand()}`).execute(interaction, date, db);
    }
}