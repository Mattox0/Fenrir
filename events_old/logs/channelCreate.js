const { EmbedBuilder, AuditLogEvent } = require("discord.js");


module.exports = {
	name: 'channelCreate',
	execute(...params) {
        let channel = params[0];
        let db = params[1];
        let date = new Date()
        db.query("SELECT channelCreate, logs_id FROM logs WHERE guild_id = ?",channel.guild.id, async (err, rows) => {
            if (err) {return console.log(err) }
            if (rows.length === 0) {return}
            let res = rows[0]
            if (res.channelCreate) {
                let chann = await channel.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.ChannelCreate,
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le salon ${channel} a été crée**\n\n**Nom :** ${channel.name}\n\n**ID** : ${channel.id}\n\n**Date de création :** <t:${Math.ceil(channel.createdTimestamp / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le salon ${channel} a été crée par ${deletionLog.executor} !**\n\n**Nom :** ${channel.name}\n\n**ID** : ${channel.id}\n\n**Date de création :** <t:${Math.ceil(channel.createdTimestamp / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      