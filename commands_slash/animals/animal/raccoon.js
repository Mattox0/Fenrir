const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const translate = require('@iamtraction/google-translate');

module.exports = {
    async execute(...params) {
        let interaction = params[0];
        let date = params[1];
        error = false;
        const wait = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Génération de l\'image** <a:LMT_loading:1065616439836414063>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        fetch(`https://some-random-api.ml/animal/raccoon`)
        .then((response) => response.json())
        .catch(err => {
            console.log(err)
            error = true;
            const echec = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds:[echec], ephemeral: true });
        })
        .then(data => {
            if (error) throw new Error('Error');
            if (data["fact"]) {
                translate(data["fact"], { from: 'en', to: 'fr' }).then(res => {
                    const panda_roux = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`${res.text}`)
                        .setImage(`${data["image"]}`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.editReply({ embeds : [panda_roux]});
                }).catch(err => {
                    console.log(err);
                    const echec = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.editReply({ embeds:[echec], ephemeral: true });
                })
            } else {
                console.log('Error')
                const echec = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.editReply({ embeds:[echec], ephemeral: true });
            };
        }).catch(err => {
            console.log(err)
            const echec = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds:[echec], ephemeral: true });
        });
    }
}