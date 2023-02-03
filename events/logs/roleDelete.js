const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	name: 'roleDelete',
	async execute(...params) {
        let role = params[0];
        let db = params[1];
        let date = new Date()
        db.get("SELECT roleDelete, logs_id FROM logs WHERE guild_id = ?",role.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return;
            if (res.roleDelete) {
                let chann = await role.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await role.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'ROLE_DELETE',
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le rôle @${role.name} a été supprimé !**\n\n**ID** : ${role.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le rôle @${role.name} a été supprimé par ${deletionLog.executor} !**\n\n**ID** : ${role.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      