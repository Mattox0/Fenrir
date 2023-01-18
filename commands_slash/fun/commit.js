const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const got = require('got');
const jsdom = require('jsdom');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commit')
        .setDescription('Invente un nom de commit aléatoire {Developper}'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const vgmUrl= `http://whatthecommit.com`;
        const response = await got(vgmUrl);
        const dom = new jsdom.JSDOM(response.body);
        const nodeList = [...dom.window.document.querySelectorAll('p')];
        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **${nodeList[0].textContent}**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[embed]});
    }
}