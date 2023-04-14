const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
	name: 'messageDeleteBulk',
	async execute(...params) {
        let messages = params[0];
        let db = params[2];
        let client = params[3];
        let date = new Date();
        db.query("SELECT messageDelete, logs_id FROM logs WHERE guild_id = ?", messages.first().guildId, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) return;
            res = res[0];
            if (res.messageDelete) {
                let guild = await client.guilds.fetch(messages.first().guildId)
                let chann = await guild.channels.cache.find(x => x.id === res.logs_id);
                let bulkChann = await guild.channels.cache.find(x => x.id === messages.first().channelId);
                if (!chann) return;
                const fetchedLogs = await guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MessageBulkDelete,
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${messages.size} messages ont été supprimé dans ${bulkChann}**\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${messages.size} messages ont été supprimé dans ${bulkChann}**\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      