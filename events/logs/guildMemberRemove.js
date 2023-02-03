const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	name: 'guildMemberRemove',
	async execute(...params) {
        let Member = params[0];
        let db = params[1];
        let date = new Date();
        if (Member.guild.id === "707953787477688360") {
            db.run("DELETE FROM reminderMember WHERE user_id = ?",Member.user.id, (err) => {if (err) console.log(err)});
        }
        db.get("SELECT guildMemberRemove, logs_id FROM logs WHERE guild_id = ?",Member.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return
            if (res.guildMemberRemove) {
                let chann = await Member.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await Member.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_KICK',
                });
                const kickLog = fetchedLogs.entries.first();
                time = Math.abs(date - Member.joinedTimestamp);
                if (Math.floor(time / (1000)) > 1) nbTime = `${Math.floor(time / (1000))} secondes`;
                if (Math.floor(time / (1000*60)) > 1) nbTime = `${Math.floor(time / (1000*60))} minutes`;
                if (Math.floor(time / (1000*60*60)) > 1) nbTime = `${Math.floor(time / (1000*60*60))} heures` ;
                if(Math.floor(time / (1000*60*60*24)) > 1) nbTime = `${Math.floor(time / (1000*60*60*24))} jours`;
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
        // 1640726528840
        // 1640728806
    }
}      