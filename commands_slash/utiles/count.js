const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('count')
        .setDescription('Compte le nombre de caractères d\'une phrase | Utile aux développeurs')
        .addStringOption(option => option.setName('texte').setDescription('Texte à compter').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let text = interaction.options.getString('texte');
        const win = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **${text.length}**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win]});
    }
}