const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Traduis votre texte dans la langue de votre choix')
        .addStringOption(option => option.setName('text').setDescription('Le texte a convertir').setRequired(true))
        .addStringOption(option => option.setName('from').setDescription('Par exemple : "fr" pour français | auto par défaut').setRequired(false))
        .addStringOption(option => option.setName('to').setDescription('Par exemple : "en" pour anglais | en par défaut' ).setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let texte = interaction.options.getString('text');
        let from = interaction.options.getString('from') || 'auto';
        let to = interaction.options.getString('to') || 'en';
        let flag_from = from.toLowerCase();
        let flag_to = to.toLowerCase();
        if (from === 'auto') {
            translate(texte, {to: to.toLowerCase() }).then(res => {
                if (to === 'en') flag_to = 'gb';
                const trad = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`**${from.toUpperCase()}** ${texte}\n\n:flag_${flag_to}: **${to.toUpperCase()}** ${res.text}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[trad]});
            }).catch(err => {
                console.log(err);
                const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Je n'ai pas compris votre demande !\nMerci de mettre un language valide [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)**\n\n> \`/translate fr en Coucou !\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [ fail ], ephemeral:true});
            });
        } else {
            translate(texte, {from: from.toLowerCase(),to: to.toLowerCase() }).then(res => {
                if (from === 'en') flag_from = 'gb';
                if (to === 'en') flag_to = 'gb';
                const trad = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`:flag_${flag_from}: **${from.toUpperCase()}** ${texte}\n\n:flag_${flag_to}: **${to.toUpperCase()}** ${res.text}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[trad]});
            }).catch(err => {
                console.log(err);
                const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Je n'ai pas compris votre demande !\nMerci de mettre un language valide [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)**\n\n> \`/translate fr en Coucou !\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [ fail ], ephemeral:true});
            });
        }
    }
}