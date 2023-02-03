const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disable')
        .setDescription('Permet de désactiver les différents systèmes')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticket')
                .setDescription('Désactive le système de ticket'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('suggestion')
                .setDescription('Désactive le système de suggestion'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('anniversaire')
                .setDescription('Désactive le système d\'anniversaire'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Désactive le système de comptage de membres'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription('Désactive le système de logs'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('prison')
                .setDescription('Désactive le système de prison'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('privateroom')
                .setDescription('Désactive le système de vocaux privées'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bumps')
                .setDescription('Désactive le système de classement de bumps')),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const notperms = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu n'as pas les permissions faire cela !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms], ephemeral: true})
        };
        require(`./disable/${interaction.options.getSubcommand()}`).execute(interaction, db,date);
    }
}