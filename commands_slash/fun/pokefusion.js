const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const jsdom = require('jsdom')
const got = require('got')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokefusion')
        .setDescription('Invoque un mélange de 2 pokémons'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const wait = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Génération de l\'image** <a:LMT__loading:877990312432254976>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        let num1 = Math.ceil(Math.random() * 152);
        let num2 = Math.ceil(Math.random() * 152);
        const vgmUrl= `https://pokemon.alexonsager.net/${num1}/${num2}`;
        const response = await got(vgmUrl);
        const dom = new jsdom.JSDOM(response.body);
        const nodeList = [...dom.window.document.querySelectorAll('#select1')];
        textNum1 = await nodeList[0].options[num1-1].text.toLowerCase();
        textNum2 = await nodeList[0].options[num2-1].text.toLowerCase();
        await fetch(`https://pokeapi.co/api/v2/pokemon/${textNum1}`)
        .then(response => response.json())
        .then(async data => {
            await fetch(data["species"]["url"])
            .then(response => response.json())
            .then(data => {
                nameText1 = data["names"]["4"]["name"]
            })
        })
        await fetch(`https://pokeapi.co/api/v2/pokemon/${textNum2}`)
        .then(response => response.json())
        .then(async data => {
            await fetch(data["species"]["url"])
            .then(response => response.json())
            .then(data => {
                nameText2 = data["names"]["4"]["name"]
            })
        })
        const pokefusion = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle(`${nameText1} <a:LMT__etoiles:910840707865014322> ${nameText2}`)
            .setImage(`https://images.alexonsager.net/pokemon/fused/${num1}/${num1}.${num2}.png`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.editReply({embeds:[pokefusion]})
    }
}