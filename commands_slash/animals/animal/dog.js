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
        let trad
        // await fetch(`https://dog-facts-api.herokuapp.com/api/v1/resources/dogs/all`)
        // .then((response) => response.json())
        // .then(async data => {
        //     await translate(data[Math.floor(Math.random() * data.length)]["fact"], { from: 'en', to: 'fr' }).then(res => {
        //         trad = res.text;
        //     }).catch(err => {
        //         console.log(err)
        //         const echec = new EmbedBuilder()
        //             .setColor('#2f3136')
        //             .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
        //             .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        //         return interaction.editReply({ embeds:[echec], ephemeral: true });
        //     })
        // })
        fetch(`https://random.dog/woof.json`)
        .then((resp) => resp.json())
        .catch(err => {
            console.log(err)
            error = true;
            const echec = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds:[echec], ephemeral: true });
        })
        .then(donnees => {
            if (error) throw new Error('Erreur dog');
            const dog = new EmbedBuilder()
                .setColor("#2f3136")
                //.setDescription(`${trad}`)
                .setImage(`${donnees["url"]}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds : [dog]}); 
        }).catch(err => {
            console.log(err)
            const echec = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds:[echec], ephemeral: true });
        })
    }
}