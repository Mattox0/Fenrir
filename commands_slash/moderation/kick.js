const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Exclu un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif :)').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('La raison du bannissement').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Tu ne peux pas faire justice toi-même !** \n**Appelle une personne plus qualifiée qui pourra t\'**\n**aider dans la démarche de l\'exclusion**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        let person = interaction.options.getUser('utilisateur');
        let raison = interaction.options.getString('raison');
        if (!raison) raison = "Aucune raison n'a été donnée";
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        person.kick({reason : raison}).then((member) => {
            const ban = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`**${member} a été exclu !\n\n${interaction.member} a décidé de vous éliminer, et sa sentence est irrévocable.**\n\n> Raison : ${raison}`)
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/920829502861492314/727224531021987880.png')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [ban]});
        }).catch((e) => {
            console.log(e)
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Mon rôle doit être au dessus des autres pour que je puisse exclure**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral:true });
        });
    }
}