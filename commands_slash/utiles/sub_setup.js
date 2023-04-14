const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Permet de configurer les différents systèmes')
        .addSubcommand(subcommand =>
            subcommand
                .setName('infos')
                .setDescription('Affiche tous les systèmes de votre serveur'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticket')
                .setDescription('Active le systeme de ticket')
                .addChannelOption(option => option.setName('channel').setDescription('Le salon où seront les demandes de tickets').setRequired(true))
                .addStringOption(option => option.setName('embedmessage').setDescription('Un message personalisé sur votre demande de ticket').setRequired(false))
                .addRoleOption(option => option.setName('role').setDescription('Le rôle qui auront accès aux tickets en tant que modérateur').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('suggestion')
                .setDescription('Active le systeme de suggestion')
                .addChannelOption(option => option.setName('channel').setDescription('Le salon où seront les suggestions').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('anniversaire')
                .setDescription('Active le systeme d\'anniversaire')
                .addChannelOption(option => option.setName('channel').setDescription('Le salon où seront les messages d\'anniversaires').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Active le systeme de comptage de membres')
                .addBooleanOption(option => option.setName('online').setDescription('Si vous voulez un salon "Membres en lignes : <nombre>"').setRequired(true))
                .addBooleanOption(option => option.setName('bot').setDescription('Si vous voulez un salon "Bot : <nombre>"').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription('Active le systeme de logs | Si vous ne choississez rien, tout sera activé par défaut')
                .addChannelOption(option => option.setName('channel').setDescription('Le salon où seront envoyés les logs').setRequired(true))
                .addBooleanOption(option => option.setName('createchannel').setDescription('Si vous voulez être informé lors de la création d\'un salon').setRequired(false))
                .addBooleanOption(option => option.setName('deletechannel').setDescription('Si vous voulez être informé lors de la suppression d\'un salon').setRequired(false))
                .addBooleanOption(option => option.setName('updatechannel').setDescription('Si vous voulez être informé lors d\'une modification d\'un salon').setRequired(false))
                .addBooleanOption(option => option.setName('messagedelete').setDescription('Si vous voulez être informé lors d\'une suppression d\'un message').setRequired(false))
                .addBooleanOption(option => option.setName('messageupdate').setDescription('Si vous voulez être informé lors de la modification d\'un message').setRequired(false))
                .addBooleanOption(option => option.setName('rolecreate').setDescription('Si vous voulez être informé lors de la création d\'un rôle').setRequired(false))
                .addBooleanOption(option => option.setName('roledelete').setDescription('Si vous voulez être informé lors de la suppression d\'un rôle').setRequired(false))
                .addBooleanOption(option => option.setName('roleupdate').setDescription('Si vous voulez être informé lors de la modification d\'un rôle').setRequired(false))
                .addBooleanOption(option => option.setName('emojicreate').setDescription('Si vous voulez être informé lors de la création d\'un emoji').setRequired(false))
                .addBooleanOption(option => option.setName('emojidelete').setDescription('Si vous voulez être informé lors de la suppression d\'un emoji').setRequired(false))
                .addBooleanOption(option => option.setName('emojiupdate').setDescription('Si vous voulez être informé lors de la modification d\'un emoji').setRequired(false))
                .addBooleanOption(option => option.setName('voiceupdate').setDescription('Si vous voulez être informé lors des informations des salons vocaux').setRequired(false))
                .addBooleanOption(option => option.setName('userupdate').setDescription('Si vous voulez être informé lors des modifications des informations d\'un utilisateur').setRequired(false))
                .addBooleanOption(option => option.setName('userjoin').setDescription('Si vous voulez être informé lorsque un utilisateur rejoint votre serveur').setRequired(false))
                .addBooleanOption(option => option.setName('userleft').setDescription('Si vous voulez être informé lorsque un utilisateur quitte votre serveur').setRequired(false))
                .addBooleanOption(option => option.setName('userban').setDescription('Si vous voulez être informé lorsque un utilisateur est ban de votre serveur').setRequired(false))
                .addBooleanOption(option => option.setName('userunban').setDescription('Si vous voulez être informé lorsque un utilisateur est unban de votre serveur').setRequired(false))
                .addBooleanOption(option => option.setName('invite').setDescription('Si vous voulez être informé lorsque un utilisateur crée/supprime une invitation').setRequired(false))
                .addBooleanOption(option => option.setName('sticker').setDescription('Si vous voulez être informé lorsque un sticker est crée ou supprimé').setRequired(false))
                .addBooleanOption(option => option.setName('thread').setDescription('Si vous voulez être informé lorsque un thread est crée ou supprimé').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('prison')
                .setDescription('Active le systeme de prison')
                .addRoleOption(option => option.setName('role').setDescription('Le rôle qui auront accès en tant que modérateur à la prison').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('privateroom')
                .setDescription('Active le systeme salons privées')
                .addChannelOption(option => option.setName('category').setDescription('La catégorie dans laquelle aura lieu les salons privées | Si rien -> crée une nouvelle').setRequired(false))
                .addChannelOption(option => option.setName('channel').setDescription('Le salon dans lequel aura lieu les demandes de salons privées | Si rien -> crée un nouveau').setRequired(false))),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const notperms = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu n'as pas les permissions \`Administrator\` pour faire cela !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms], ephemeral: true})
        };
        require(`./setup/${interaction.options.getSubcommand()}`).execute(interaction, db,date);
    }
}