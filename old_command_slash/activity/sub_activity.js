const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Le système pour gérer toutes les activitées de discord')
        .addSubcommand(subcommand =>
            subcommand
                .setName('awkword')
                .setDescription('Lance l\'activité "Awkword"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('betrayal')
                .setDescription('Lance l\'activité "Betrayal"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('checkers')
                .setDescription('Lance l\'activité "Checkers"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('chess')
                .setDescription('Lance l\'activité "Echecs"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('doodlecrew')
                .setDescription('Lance l\'activité "Doodle Crew"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('fishing')
                .setDescription('Lance l\'activité "Fishing"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lettertile')
                .setDescription('Lance l\'activité "Lettertile"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('poker')
                .setDescription('Lance l\'activité "Poker"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('puttparty')
                .setDescription('Lance l\'activité "PuttParty"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('sketchyartists')
                .setDescription('Lance l\'activité "Sketchy Artists"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('spellcast')
                .setDescription('Lance l\'activité "SpellCast"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('youtube')
                .setDescription('Lance l\'activité "Youtube Together"'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('wordsnack')
                .setDescription('Lance l\'activité "Wordsnack"')),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        require(`./activity/${interaction.options.getSubcommand()}`).execute(interaction, date);
    }
}