const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
	name: 'guildBanAdd',
	async execute(...params) {
        let Member = params[0];
        let db = params[1];
        let date = new Date();
        db.get("SELECT guildBanAdd, logs_id FROM logs WHERE guild_id = ?",Member.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return;
            if (res.guildBanAdd) {
                let chann = await Member.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await Member.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_BAN_ADD',
                });
                const banLog = fetchedLogs.entries.first();
                if (!banLog) {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **${Member} a été banni** !\n\n**ID** : ${Member.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setThumbnail(banLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${banLog.executor.username}#${banLog.executor.discriminator}`, iconURL:`${banLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT__arrow:831817537388937277> **${Member.user} a été banni par ${banLog.executor}** !\n\n**ID** : ${Member.user.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      