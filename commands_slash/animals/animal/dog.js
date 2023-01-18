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
        let trad
        // await fetch(`https://dog-facts-api.herokuapp.com/api/v1/resources/dogs/all`)
        // .then((response) => response.json())
        // .then(async data => {
        //     await translate(data[Math.floor(Math.random() * data.length)]["fact"], { from: 'en', to: 'fr' }).then(res => {
        //         trad = res.text;
        //     }).catch(err => {
        //         console.log(err)
        //         const echec = new MessageEmbed()
        //             .setColor('#2f3136')
        //             .setDescription(`<a:LMT__arrow:831817537388937277> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
        //             .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        //         return interaction.editReply({ embeds:[echec], ephemeral: true });
        //     })
        // })
        fetch(`https://random.dog/woof.json`)
        .then((resp) => resp.json())
        .then(donnees => {
            const dog = new MessageEmbed()
                .setColor("#2f3136")
                //.setDescription(`${trad}`)
                .setImage(`${donnees["url"]}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds : [dog]}); 
        });
    }
}