const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xkcd')
        .setDescription('Affiche un meme xkcd'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        fetch(`https://xkcd.com/${Math.floor(Math.random() * 2540)}/info.0.json`)
        .then(response => response.json())
        .then(body => {
            const xkcdEmbed = new MessageEmbed()
                .setColor('#FFFFFF')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                .setDescription(body.alt)
                .setTitle(body.title)
                .setImage(body.img);
            return interaction.reply({embeds:[xkcdEmbed]});
        })
    }
}