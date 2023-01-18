const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const superagent = require('superagent');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stickbug')
        .setDescription('Invoque un stickbug sur la photo d\'un utilisateur ou de soi-même')
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affichera votre photo').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = interaction.member;
        else person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        const wait = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Génération de l\'image** <a:LMT__loading:877990312432254976>\n\n> `(un peu long, c\'est une vidéo.)\`')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        let av = person.user.displayAvatarURL({ format:'png',size:512, dynamic: false })
        superagent.get('https://nekobot.xyz/api/imagegen')
        .query({ type: 'stickbug', url: `${av}` })
        .end((err, response) => {
            if (err) return console.log(err);
            const stickbug = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`Voici votre stickbug :\n\n${response.body.message}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            interaction.editReply({embeds:[stickbug]});
        })
    }
}