const superagent = require('superagent');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changemymind')
        .setDescription('Change my mind !')
        .addStringOption(option => option.setName('texte').setDescription('Le texte que vous voulez mettre !').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const wait = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Génération de l\'image** <a:LMT__loading:877990312432254976>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        let text = interaction.options.getString('texte');
        superagent.get('https://nekobot.xyz/api/imagegen')
        .query({ type: 'changemymind', text: text})
        .end((err, response) => {
            if (err) return console.log(err);
            const changemymind = new MessageEmbed()
                .setColor('#2f3136')
                .setImage(`${response.body.message}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            interaction.editReply({content:'',embeds:[changemymind]});
        })
    }
}