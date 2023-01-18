const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const translate = require('@iamtraction/google-translate');

module.exports = {
    async execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const wait = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Génération de l\'image** <a:LMT__loading:877990312432254976>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        let trad;
        let random = Math.floor(Math.random() * 46);
        await fetch(`https://elephant-api.herokuapp.com/elephants`)
        .then(r => r.json())
        .then(async data => {
            await translate(data[random]["note"], { from : 'en', to: 'fr'}).then(res => {
                trad = res.text
            }).catch(err => {
                const echec = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.editReply({ embeds:[echec], ephemeral: true });
            });
        })
        fetch(`https://elephant-api.herokuapp.com/elephants`)
        .then(r => r.json())
        .then(data => {
            const elephant = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`${trad}`)
                .setImage(data[random]["image"])
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({embeds : [ elephant ]});
        }).catch(err => {
            console.log(err);
            const echec = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds:[echec], ephemeral: true });
        });
    }
}