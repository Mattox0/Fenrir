const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require("discord.js");

module.exports = {
	name: 'threadDelete',
	async execute(...params) {
        let thread = params[0];
        let db = params[1];
        let date = new Date()
        db.query("SELECT threadDelete, logs_id FROM logs WHERE guild_id = ?", thread.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (res.length === 0) return;
            res = res[0];
            if (res.threadDelete) {
                let chann = await thread.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await thread.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.ThreadDelete,
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Un fil a été supprimé !**\n\n**Nom** : \`${thread.name}\`\n\n**ID** : ${thread.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Un fil a été supprimé par ${deletionLog.executor} !**\n\n**Nom** : \`${thread.name}\`\n\n**ID** : ${thread.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      