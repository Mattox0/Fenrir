const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'messageDeleteBulk',
	async execute(...params) {
        let messages = params[0];
        let db = params[1];
        let client = params[2];
        let date = new Date();
        db.get("SELECT messageDelete, logs_id FROM logs WHERE guild_id = ?",messages.first().guildId, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) {return}
            if (res.messageDelete) {
                let guild = await client.guilds.fetch(messages.first().guildId)
                let chann = await guild.channels.cache.find(x => x.id === res.logs_id);
                let bulkChann = await guild.channels.cache.find(x => x.id === messages.first().channelId);
                if (!chann) return;
                const fetchedLogs = await guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MESSAGE_BULK_DELETE',
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **${messages.size} messages ont été supprimé dans ${bulkChann}**\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT__arrow:831817537388937277> **${messages.size} messages ont été supprimé dans ${bulkChann}**\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      