const { MessageEmbed } = require("discord.js");


module.exports = {
	name: 'channelUpdate',
	execute(...params) {
        let oldChann = params[0];
        let newChann = params[1];
        let db = params[2];
        let date = new Date()
        db.get("SELECT channelUpdate, logs_id FROM logs WHERE guild_id = ?",oldChann.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) {return}
            if (res.channelUpdate) {
                let chann = await oldChann.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const fetchedLogs = await newChann.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'CHANNEL_UPDATE',
                });
                const deletionLog = fetchedLogs.entries.first();
                let event;
                let description;
                let modif = false;
                if (!deletionLog) {
                    const event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **Le salon ${newChann} a été modifié !**\n\n**ID** : ${newChann.id}\n\n**Date de modification :** <t:${Math.ceil(date / 1000)}:F>`)
                        .addFields(
                            {name:"Ancien nom", value:oldChann.name, inline:true},
                            {name:'Nouveau Nom',value:newChann.name, inline:true}
                        )
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return chann.send({embeds:[event]});
                } else {
                    event = new MessageEmbed()
                        .setColor('#2f3136')
                        .setThumbnail(deletionLog.executor.displayAvatarURL({dynamic:true}))
                        .setAuthor({name:`${deletionLog.executor.username}#${deletionLog.executor.discriminator}`, iconURL:`${deletionLog.executor.displayAvatarURL()}`})                            
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    description = `<a:LMT__arrow:831817537388937277> **Le salon ${newChann} a été modifié par ${deletionLog.executor} !**\n\n**Channel ID** : ${newChann.id}\n\n**Date de modification :** <t:${Math.ceil(date / 1000)}:F>\n\n`

                }
                if (oldChann.name !== newChann.name) {
                    modif = true
                    description += `> **Nom** : \`${oldChann.name}\` <a:LMT__arrow:831817537388937277> \`${newChann.name}\`\n`;
                } 
                if (oldChann.topic !== newChann.topic) {
                    modif = true
                    description += `> **Sujet du salon** : \`${oldChann.topic ? oldChann.topic : "Aucun"}\` <a:LMT__arrow:831817537388937277> \`${newChann.topic ? newChann.topic : "Aucun"}\`\n`;
                }
                if (oldChann.nsfw !== newChann.nsfw) {       
                    modif = true
                    description += `> **NSFW** : ${oldChann.nsfw ? '✅' : '❌'} <a:LMT__arrow:831817537388937277> ${newChann.nsfw ? '✅' : '❌'}\n`;
                }
                if (oldChann.rateLimitPerUser !== newChann.rateLimitPerUser) {
                    modif = true
                    tab = ['Désactiver','5 secondes','10 secondes','15 secondes','30 secondes','1 minutes','2 minutes','5 minutes','10 minutes','15 minutes','30 minutes','1 heure','2 heures','6 heures']
                    tab2 = [0,5,10,15,30,60,2*60,5*60,10*60,15*60,30*60,1*3600,2*3600,6*3600]
                    oldSlow = tab[tab2.indexOf(oldChann.rateLimitPerUser)];
                    newSlow = tab[tab2.indexOf(newChann.rateLimitPerUser)];
                    description += `> **Slowmode** : \`${oldSlow}\` <a:LMT__arrow:831817537388937277> \`${newSlow}\`\n`;
                }
                event.setDescription(description);
                if (modif) return chann.send({embeds:[event]});
            }
        })
    }
}      