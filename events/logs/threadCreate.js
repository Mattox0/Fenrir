const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
	name: 'threadCreate',
	async execute(...params) {
        let thread = params[0];
        let db = params[1];
        let date = new Date()
        db.get("SELECT threadCreate, logs_id FROM logs WHERE guild_id = ?",thread.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return
            if (res.threadCreate) {
                let chann = await thread.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await thread.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'THREAD_CREATE',
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **Un fil a été crée !**\n\n**Nom** : \`${thread.name}\`\n\n**ID** : ${thread.id}\n\n**Date de création :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT__arrow:831817537388937277> **Un fil a été crée par ${deletionLog.executor} !**\n\n**Nom** : \`${thread.name}\`\n\n**ID** : ${thread.id}\n\n**Date de création :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      