const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('interserveur')
        .setDescription('Permet d\'installer un système d\'interserveur')
        .addSubcommand(subcommand =>
            subcommand
                .setName('infos')
                .setDescription('Affiche tous les interserveur de votre serveur'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('open')
                .setDescription('Ouvre une connexion d\'interserveur')
                .addChannelOption(option => option.setName('channel').setDescription('Salon où sera l\'interserveur | Si rien -> salon actuel').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Joins une connexion d\'interserveur')
                .addStringOption(option => option.setName('code').setDescription('Le code qui a été ouvert lors de l\'ouverture !').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('Salon où sera l\'interserveur | Si rien -> salon actuel').setRequired(false))),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        let client =  params[1];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const notperms = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu n'as pas les permissions faire cela !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms], ephemeral: true})
        };
        require(`./interserveur/${interaction.options.getSubcommand()}`).execute(interaction, db, date, client);
    }
}         