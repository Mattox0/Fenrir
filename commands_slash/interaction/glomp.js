const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('glomp')
        .setDescription('Glousse !'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        try {
            fetch('https://api.waifu.pics/sfw/glomp')
            .then(r => r.json())
            .then(data => {
                const glomp = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> ${interaction.member.nickname ? interaction.member.nickname : interaction.member.user.username} **glousse**`)
                    .setImage(data["url"])
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [ glomp ]});
            });
        } catch (e) {
            console.error(e);
			const echec = new MessageEmbed()
				.setColor('#2f3136')
				.setDescription(`<a:LMT__arrow:831817537388937277> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
				.setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
			await interaction.reply({ embeds:[echec], ephemeral: true });
        };
    }
}