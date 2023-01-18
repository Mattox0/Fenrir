const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cry')
        .setDescription('Pleure auprès de quelqu\'un')
        .addUserOption(option => option.setName('utilisateur').setDescription('La personne aupres de laquelle tu veux pleurer | Si rien -> personne aléatoire').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = await interaction.member.guild.members.cache.random();
        else person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        try {
            fetch('https://api.waifu.pics/sfw/cry')
            .then(r => r.json())
            .then(data => {
                const cry = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> ${interaction.member.nickname ? interaction.member.nickname : interaction.member.user.username} **pleure** auprès de ${person.nickname ? person.nickname : person.user.username}`)
                    .setImage(data["url"])
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [ cry ]});
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