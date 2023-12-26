const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Attribue une note sur 20')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Note un utilisateur sur 20')
                .addUserOption(option => option.setName('utilisateur').setDescription('Personne que je doit noter').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('something')
                .setDescription('Note quelque chose sur 20')
                .addStringOption(option => option.setName('note').setDescription('La chose à noter').setRequired(true))),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        require(`./rate/${interaction.options.getSubcommand()}`).execute(interaction, date);
    }
}