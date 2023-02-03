const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	name: 'emojiUpdate',
	async execute(...params) {
        let oldEmoji = params[0];
        let newEmoji = params[1];
        let db = params[2];
        let date = new Date()
        db.get("SELECT emojiUpdate, logs_id FROM logs WHERE guild_id = ?",oldEmoji.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return
            if (res.emojiUpdate) {
                let chann = await oldEmoji.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await newEmoji.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'EMOJI_UPDATE',
                });
                const deletionLog = fetchedLogs.entries.first();
                if (oldEmoji.name !== newEmoji.name) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})                            
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **L'emoji ${newEmoji} a été modifié par ${deletionLog.executor} !**\n\n**Channel ID** : ${newEmoji.id}\n\n**Date de modification :** <t:${Math.ceil(date / 1000)}:F>\n\n> **Nom** : \`${oldEmoji.name}\` <a:LMT_arrow:1065548690862899240> \`${newEmoji.name}\``)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      