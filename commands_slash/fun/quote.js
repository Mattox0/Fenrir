const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require('node-fetch')
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Affiche une citation issue d\'un animé'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        fetch('https://animechan.vercel.app/api/random')
        .then(response => response.json())
        .then(async quote => {
            translate(quote['quote'], {from:'en',to:'fr'}).then(res => {
                const quoted = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`${res.text}\n\n> **${quote["character"]}** dans **${quote["anime"]}**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [ quoted ]});
            })     
        }).catch(err => {
            console.log(err);
            const fail = new MessageEmbed()
            .setColor('#2f3136') 
            .setDescription(`<a:LMT__arrow:831817537388937277> **Il y a eu une erreur désolé...**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds : [ fail ], ephemeral : true});
        });
    }
}