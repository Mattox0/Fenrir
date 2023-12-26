const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tierlist')
        .setDescription('Classe les différents éléments donnés')
        .addStringOption(option => option.setName('element1').setDescription('Le premier élément').setRequired(true))
        .addStringOption(option => option.setName('element2').setDescription('Le deuxième élément').setRequired(true))
        .addStringOption(option => option.setName('element3').setDescription('Le troisième élément').setRequired(false))
        .addStringOption(option => option.setName('element4').setDescription('Le quatrième élément').setRequired(false))
        .addStringOption(option => option.setName('element5').setDescription('Le cinqième élément').setRequired(false))
        .addStringOption(option => option.setName('element6').setDescription('Le sixième élément').setRequired(false))
        .addStringOption(option => option.setName('element7').setDescription('Le septième élément').setRequired(false))
        .addStringOption(option => option.setName('element8').setDescription('Le huitième élément').setRequired(false))
        .addStringOption(option => option.setName('element9').setDescription('Le neuvième élément').setRequired(false))
        .addStringOption(option => option.setName('element10').setDescription('Le dixième élément').setRequired(false))
        .addStringOption(option => option.setName('element11').setDescription('Le onzième élément').setRequired(false))
        .addStringOption(option => option.setName('element12').setDescription('Le douzième élément').setRequired(false))
        .addStringOption(option => option.setName('element13').setDescription('Le treizième élément').setRequired(false))
        .addStringOption(option => option.setName('element14').setDescription('Le quatorzième élément').setRequired(false))
        .addStringOption(option => option.setName('element15').setDescription('Le quinzième élément').setRequired(false))
        .addStringOption(option => option.setName('element16').setDescription('Le seizième élément').setRequired(false))
        .addStringOption(option => option.setName('element17').setDescription('Le dixseptième élément').setRequired(false))
        .addStringOption(option => option.setName('element18').setDescription('Le dixhuitième élément').setRequired(false))
        .addStringOption(option => option.setName('element19').setDescription('Le dixneuvième élément').setRequired(false))
        .addStringOption(option => option.setName('element20').setDescription('Le vingtième élément').setRequired(false))
        .addStringOption(option => option.setName('element21').setDescription('Le vingt-unième élément').setRequired(false))
        .addStringOption(option => option.setName('element22').setDescription('Le vingt-deuxième élément').setRequired(false))
        .addStringOption(option => option.setName('element23').setDescription('Le vingt-troisième élément').setRequired(false))
        .addStringOption(option => option.setName('element24').setDescription('Le vingt-quatrième élément').setRequired(false))
        .addStringOption(option => option.setName('element25').setDescription('Le vint-cinquième élément').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let count = 0;
        let tab = [];
        for (let x = 0; x < 25; x++) {
            count++;
            let elem = interaction.options.getString(`element${count}`);
            if (elem) tab.push(elem);
            else break;
        }
        tab = tab.sort(function(a, b) {return 0.5 - Math.random()});
        description = "";
        count = 0;
        tab.forEach(item => {
            count++;
            description += `**#${count}** - ${item}\n`;
        })
        const tierlist = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(description)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({ embeds : [tierlist]})
    }
}