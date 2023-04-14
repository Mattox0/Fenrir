const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
	name: 'messageDelete',
	async execute(...params) {
        let message = params[0];
        let db = params[1];
        let date = new Date()
        db.query("SELECT messageDelete, logs_id FROM logs WHERE guild_id = ?", message.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (res.length === 0) return
            res = res[0];
            if (res.messageDelete) {
                let chann = await message.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await message.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MessageDelete,
                });
                const deletionLog = fetchedLogs.entries.first();
                if (message.content === null) return;
                if (!deletionLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le message de ${message.author} a été supprimé dans ${message.channel}**\n\n> ${message.content}\n\n**ID** : ${message.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le message de ${message.author} a été supprimé par ${deletionLog.executor} dans ${deletionLog.extra.channel}**\n\n> ${message.content} \n\n**ID** : ${message.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      