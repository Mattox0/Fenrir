const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const schedule = require('node-schedule')

module.exports = {
	name: 'guildMemberAdd',
	async execute(...params) {
        let Member = params[0];
        let db = params[1];
        let date = new Date()
        db.query("SELECT guildMemberAdd, logs_id FROM logs WHERE guild_id = ?",Member.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (res.length === 0) return;
            res = res[0];
            if (res.guildMemberAdd) {
                let chann = await Member.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const event = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setThumbnail(Member.user.displayAvatarURL({dynamic:true}))
                    .setAuthor({name:`${Member.user.username}#${Member.user.discriminator}`, iconURL:`${Member.user.displayAvatarURL()}`})
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **${Member} a rejoint le serveur !**\n\n**Création du compte** : <t:${Math.ceil(Member.user.createdTimestamp / 1000)}:R>\n\n**ID** : ${Member.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return chann.send({embeds:[event]});
            }
        })
    }
}      