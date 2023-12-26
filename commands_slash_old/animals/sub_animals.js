const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('animal')
        .setDescription('Affiche vos animaux préférées')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bunny')
                .setDescription('Affiche la photo d\'un lapin'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cat')
                .setDescription('Affiche la photo d\'un chat'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('dog')
                .setDescription('Affiche la photo d\'un chien'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('duck')
                .setDescription('Affiche la photo d\'un canard'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('fox')
                .setDescription('Affiche la photo d\'un renard'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('kangourou')
                .setDescription('Affiche la photo d\'un kangourou'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('koala')
                .setDescription('Affiche la photo d\'un koala'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lizard')
                .setDescription('Affiche la photo d\'un reptile'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('panda')
                .setDescription('Affiche la photo d\'un panda'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('raccoon')
                .setDescription('Affiche la photo d\'un raton laveur'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('redpanda')
                .setDescription('Affiche la photo d\'un panda roux')),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        require(`./animal/${interaction.options.getSubcommand()}`).execute(interaction, date);
    }
}