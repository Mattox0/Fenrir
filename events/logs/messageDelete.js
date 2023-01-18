const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'messageDelete',
	async execute(...params) {
        let message = params[0];
        let db = params[1];
        let date = new Date()
        db.get("SELECT messageDelete, logs_id FROM logs WHERE guild_id = ?",message.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) {return}
            if (res.messageDelete) {
                let chann = await message.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await message.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MESSAGE_DELETE',
                });
                const deletionLog = fetchedLogs.entries.first();
                if (message.content === null) return;
                if (!deletionLog) {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **Le message de ${message.author} a été supprimé dans ${message.channel}**\n\n> ${message.content}\n\n**ID** : ${message.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT__arrow:831817537388937277> **Le message de ${message.author} a été supprimé par ${deletionLog.executor} dans ${deletionLog.extra.channel}**\n\n> ${message.content} \n\n**ID** : ${message.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      