const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription('Affiche l\'id de soi ou de l\'utilisateur mentionné')
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affiche votre ID').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = interaction.user;
        const id = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`${person} <a:LMT_arrow:1065548690862899240> ${person.id}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({ embeds : [id]});
    }
}