const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require("discord.js");
const kick = require("../../commands_slash/moderation/kick");

module.exports = {
	name: 'guildMemberRemove',
	async execute(...params) {
        // console.log("memberremove -> ", params)
        let Member = params[0];
        let db = params[1];
        let date = new Date();
        db.query("SELECT guildMemberRemove, logs_id FROM logs WHERE guild_id = ?", Member.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (res.length === 0) return;
            res = res[0];
            if (res.guildMemberRemove) {
                let chann = await Member.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await Member.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberKick,
                });
                const kickLog = fetchedLogs.entries.first();
                time = Math.abs(date - Member.joinedTimestamp);
                nbTime = `${Math.floor(time / (1000))} secondes`;
                if (Math.floor(time / (1000)) > 1) nbTime = `${Math.floor(time / (1000))} secondes`;
                if (Math.floor(time / (1000*60)) > 1) nbTime = `${Math.floor(time / (1000*60))} minutes`;
                if (Math.floor(time / (1000*60*60)) > 1) nbTime = `${Math.floor(time / (1000*60*60))} heures` ;
                if(Math.floor(time / (1000*60*60*24)) > 1) nbTime = `${Math.floor(time / (1000*60*60*24))} jours`;
                if ((await Member.guild.bans.fetch()).has(Member.id)) return
                if (!kickLog || !(kickLog.target.id === Member.id)) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${Member} a quitté le serveur** !\n\n**Membre depuis** : ${nbTime}\n\n**ID** : ${Member.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail(kickLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${kickLog.executor.username}#${kickLog.executor.discriminator}`, iconURL:`${kickLog.executor.displayAvatarURL()}`})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${Member} a été exclu par ${kickLog.executor}** !\n\n**Membre depuis** : ${nbTime}\n\n**ID** : ${Member.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                }
            }
        })
    }
}      