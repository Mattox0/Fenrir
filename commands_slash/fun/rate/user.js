const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date) {
        let note = interaction.options.getUser('utilisateur');
        tab = ['un pitoyable 1/20','un lamentable 2/20','un décevant 3/20','un médiocre 4/20','un misérable 5/20','un misérable 6/20','un piètre 7/20','un navrant 8/20','un pauvre 9/20','un 10/20','un simple 11/20','un simple 12/20','un petit 13/20','un bon 14/20','un beau 15/20','un joli 16/20','un remarquable 17/20','un super 18/20','un admirable 19/20','un excellent 20/20']
        const rate = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **${note} mérite ${tab[Math.floor(Math.random() * tab.length)]} !**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({ embeds : [rate]});
    }
}