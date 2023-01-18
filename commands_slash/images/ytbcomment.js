const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ytbcomment')
        .setDescription('Cree un faux commentaire youtube de sa photo de profil ou de celle d\'un utilisateur')
        .addStringOption(option => option.setName('texte').setDescription('le texte du commentaire').setRequired(true))
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affichera votre photo').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let text = interaction.options.getString('texte');
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = interaction.member;
        else person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        const wait = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Génération de l\'image** <a:LMT__loading:877990312432254976>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        let link = `https://some-random-api.ml/canvas/youtube-comment/?username=${person.user.username}&comment=${text}&avatar=${person.user.displayAvatarURL({ format: 'png' })}`
        let attachment = new MessageAttachment(link, 'ytbcomment.png');
        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setImage('attachment://ytbcomment.png')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        interaction.editReply({embeds:[embed],files:[attachment]});
    }
}