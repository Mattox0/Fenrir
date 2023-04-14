const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Lance un giveaway')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Crée un giveaways !')
                .addChannelOption(option => option.setName('channel').setDescription('Salon où ira le giveaways').setRequired(true))
                .addStringOption(option => option.setName('temps').setDescription('Dans combien de temps se finira votre giveaways ? Exemple : 2d5h6m -> 2 jours, 5 heures et 6 minutes').setRequired(true))
                .addStringOption(option => option.setName('récompense').setDescription('Que veux-tu faire gagner ? Exemple : "Un nitro"').setRequired(true))
                .addIntegerOption(option => option.setName('winners').setDescription('Combien de gagnants ? Exemple : 2 (1 par défaut)').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('Finis un giveaway avant la date de fin')
                .addStringOption(option => option.setName('message_id').setDescription('l\'ID du message où se situe le giveaway').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Permet de relancer les résultats du giveaway')
                .addStringOption(option => option.setName('message_id').setDescription('l\'ID du message où se situe le giveaway').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('cancel')
                .setDescription('Permet d\'annuler un giveaway')
                .addStringOption(option => option.setName('message_id').setDescription('l\'ID du message où se situe le giveaway').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('count')
                .setDescription('Permet de compter les giveaways en cours dans votre serveur')),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let client = params[1];
        let db = params[4];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const notperms = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu n'as pas les permissions faire cela !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms], ephemeral: true})
        };
        require(`./giveaway/${interaction.options.getSubcommand()}`).execute(interaction, db, date, client);
    }
}