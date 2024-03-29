const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require("discord.js");

module.exports = {
	name: 'roleUpdate',
	async execute(...params) {
        let oldRole = params[0];
        let newRole = params[1];
        let db = params[2];
        let date = new Date()
        db.query ("SELECT roleUpdate, logs_id FROM logs WHERE guild_id = ?", oldRole.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (res.length === 0) return;
            res = res[0];
            if (res.roleUpdate) {
                let chann = await oldRole.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await oldRole.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.RoleUpdate,
                });
                const deletionLog = fetchedLogs.entries.first();
                let event;
                let description;
                let modif = false;
                if (!deletionLog) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le rôle ${newRole} a été modifié !**\n\n**ID** : ${newRole.id}\n\n**Date de modification :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    description = `<a:LMT_arrow:1065548690862899240> **Le rôle ${newRole} a été modifié par ${deletionLog.executor} !**\n\n**ID** : ${newRole.id}\n\n**Date de modification :** <t:${Math.ceil(date / 1000)}:F>\n\n`
                }
                if (oldRole.name !== newRole.name) {
                    modif = true
                    description += `> **Nom** : \`${oldRole.name}\` <a:LMT_arrow:1065548690862899240> \`${newRole.name}\`\n`
                }
                if (oldRole.color !== newRole.color) {
                    modif = true
                    description += `> **Couleur** : \`#${oldRole.color.toString(16)}\` <a:LMT_arrow:1065548690862899240> \`${newRole.color.toString(16)}\`\n`
                }
                event.setDescription(description);
                if (modif) return chann.send({embeds:[event]})
            }
        })
    }
}      