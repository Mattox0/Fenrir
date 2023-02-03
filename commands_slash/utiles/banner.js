const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
let date = new Date();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Affiche la banniere de soi ou d\'un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affiche votre banniere').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let Client = params[3];
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = interaction.member;
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        let banner ="";
        let response = fetch(`https://discord.com/api/v8/users/${person.user.id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${Client.token}`
            }
        })
        await response.then(async a => {
            if(a.status !== 404) {
                a.json().then(async data => {
                    receive = data['banner']
                    if(receive !== null) {
                        let format = 'png';
                        if (receive.substring(0,2) === 'a_') {
                            format = 'gif';
                        }
                        banner = `https://cdn.discordapp.com/banners/${person.user.id}/${receive}.${format}?size=2048`
                        let embed = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`Voici la banniere de **${person.user.username}**`)
                            .setImage(banner)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        await interaction.reply({embeds : [embed]});
                    } else {
                        const fail = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT_arrow:1065548690862899240> **L'utilisateur n'a pas de bannière**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return interaction.reply({ embeds : [ fail ]});
                    }
                })
            } else {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **L'utilisateur n'a pas de bannière**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [ fail ]});
            }
        })
    }
}