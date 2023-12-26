const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require("discord.js");

module.exports = {
	name: 'emojiDelete',
	async execute(...params) {
        let emoji = params[0];
        let db = params[1];
        let date = new Date()
        db.query("SELECT emojiDelete, logs_id FROM logs WHERE guild_id = ?", emoji.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (res.length === 0) return;
            res = res[0];
            if (res.emojiDelete) {
                let chann = await emoji.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await emoji.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.EmojiDelete,
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **L'emoji \`${emoji.name}\` a été supprimé !**\n\n**ID** : ${emoji.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **L'emoji \`${emoji.name}\` a été crée par ${deletionLog.executor} !**\n\n**ID** : ${emoji.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      