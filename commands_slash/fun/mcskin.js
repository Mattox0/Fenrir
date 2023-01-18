const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcskin')
        .setDescription('Affiche le skin minecraft d\'un joueur minecraft')
        .addStringOption(option => option.setName('username').setDescription('Le username minecraft').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let username = interaction.options.getString('username');
        fetch('https://api.mojang.com/users/profiles/minecraft/' + username)
        .then(response => response.json())
        .then(data => {
            let id = data.id
            skin = `https://crafatar.com/renders/body/${id}`
            rendu = `https://crafatar.com/skins/${id}`
            avatar = `https://crafatar.com/avatars/${id}`
            const mc = new MessageEmbed()
                .setColor('#2f3136')
                .setTitle(`Skin de **${username}**`)
                .setThumbnail(avatar)
                .setImage(skin)
                .setDescription(`Si tu veux télécharger ce skin\n Clique [ici](${rendu})`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[mc]});
        }).catch(()=> {
            const fail = new MessageEmbed()
            .setColor('#2f3136') 
            .setDescription(`<a:LMT__arrow:831817537388937277> **Nous n'avons pas trouvé votre profil...**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [ fail ], ephemeral:true});
        });
    }
}