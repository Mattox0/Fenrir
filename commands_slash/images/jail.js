const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,MessageAttachment } = require('discord.js');
const Canvas = require('canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jail')
        .setDescription('Met en prison un utilisateur ou soi-même')
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affichera votre photo').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = interaction.member;
        else person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        const wait = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Génération de l\'image** <a:LMT__loading:877990312432254976>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        const canvas = Canvas.createCanvas(256,256);
        const context = canvas.getContext('2d');
        const personI = await Canvas.loadImage(person.user.displayAvatarURL({ format:'png',size:256, dynamic : false}));
        context.drawImage(personI, 0, 0, canvas.width, canvas.height);
        let background = await Canvas.loadImage('./Images/jail.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'jail.png');
        const jail = new MessageEmbed()
            .setColor('#2f3136')
            .setImage(`attachment://jail.png`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        interaction.editReply({embeds:[jail],files:[attachment]})
    }
}