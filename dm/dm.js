const { MessageEmbed } = require("discord.js");

module.exports = {
    name:'dm',
    description:'',
    async execute(...params) {
        let message = params[0];
        let args = params[1];
        let date = params[2];
        let client = params[4];
        if (!message.reference) {
            return
        }
        const mess = await message.channel.messages.fetch(message.reference.messageId);
        if (mess.author.id !== "811191355635793942") {
            return
        }
        if (!args[0]) {
            const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Il faut mettre un message, pour l'envoyer**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return message.channel.send({embeds:[fail]});
        }
        const user = await client.users.fetch(mess.content.split(' ')[0].slice(1,-1))
        let tabroles = [];
        message.member._roles.forEach(role => {
            const x = message.guild.roles.cache.find(rol => rol.id === role);
            tabroles.push([parseInt(x.rawPosition),x]);
        });
        tabroles.sort(function([k,v],[a,b]) {
            return a-k;
        })
        user.send(`**\`${tabroles[0][1].name}\`  ${message.member.user.username}** : ${args.join(' ')}`)
        tab = ['<a:LMT_VerifiedBlack:904871525985955841>','<a:LMT_VerifiedBlue:904871767930183751>','<a:LMT_VerifiedDarkBlue:904871913048920064>','<a:LMT_VerifiedPink:904872261738172446>','<a:LMT_VerifiedPurple:904872416470265917>','<a:LMT_VerifiedRed:904872477585457313>','<a:LMT_VerifiedWhite:904872546367860798>']
        message.react(tab[Math.floor(Math.random() * tab.length)])
    }
}