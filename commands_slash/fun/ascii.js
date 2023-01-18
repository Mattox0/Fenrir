const figlet = require('figlet');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Convertis votre texte en ascii')
        .addStringOption(option => option.setName('texte').setDescription('Votre texte | Exemple : "Coucou"').setRequired(true))
        .addStringOption(option => option.setName('theme').setDescription('Le thème des caracteres ascii | Par defaut "Standard"').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let text = interaction.options.getString('texte');
        let font = interaction.options.getString('theme');
        if (!font) font = 'Standard';
        figlet.text(text, {
            font: font,
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }, async function(err, data) {
            if (err) {
                const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Je n'arrive pas à trouver ce thème !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail], ephemeral:true})
            }
            const ascii = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`> **Attention aux mots trop long ! | Retrouvez tous les [thèmes disponibles](https://github.com/patorjk/figlet.js/tree/master/fonts)**\n\`\`\`${data}\`\`\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[ascii]})
        });
    }
}