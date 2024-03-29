const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require("discord.js");

module.exports = {
	name: 'guildBanRemove',
	async execute(...params) {
        let member = params[0];
        let db = params[1];
        let date = new Date();
        db.query("SELECT guildBanRemove, logs_id FROM logs WHERE guild_id = ?",member.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (res.length === 0) return;
            res = res[0];
            if (res.guildBanRemove) {
                let chann = await member.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await member.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberBanRemove,
                });
                const banLog = fetchedLogs.entries.first();
                if (!banLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${member} a été débanni** !\n\n**Membre depuis** : ${nbTime}\n\n**ID** : ${member.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(banLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${banLog.executor.username}#${banLog.executor.discriminator}`, iconURL:`${banLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${member.user} a été débanni par ${banLog.executor}** !\n\n**ID** : ${member.user.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      