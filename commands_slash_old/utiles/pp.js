const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
let date = new Date();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pp')
        .setDescription('Affiche la photo de profil de soi ou d\'un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affiche votre photo de profil').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = interaction.member;
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        let embeds = [];
        if (person.avatar) {
            embeds = [
                new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`Voici les pp de **${person.user.username}**`)
                .setImage(person.displayAvatarURL({ size: 2048, dynamic: true }))
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'}),
                new EmbedBuilder().setColor('#2f3136').setImage(person.user.displayAvatarURL({ size: 2048, dynamic: true }))
            ];
        } else {
            embeds = [
                new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`Voici la pp de **${person.user.username}**`)
                    .setImage(person.displayAvatarURL({ size: 2048, dynamic: true }))
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'}),
            ];
        }
        interaction.reply({embeds : embeds});
    }
}