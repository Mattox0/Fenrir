const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	name: 'voiceStateUpdate',
	async execute(...params) {
        let oldMember = params[0];
        let newMember = params[1];
        let db = params[2];
        let client = params[3];
        let date = new Date();
        db.query("SELECT * FROM servers WHERE guild_id = ?", newMember.guild.id, async (err, rows) => {
            if (err) return console.log(err)
            if (rows.length == 0) return;
            if (oldMember.channelId === null) {
                client.events.get('voc_join').execute(newMember, date, db)
            } else if (newMember.channelId === null) {
                client.events.get('voc_left').execute(oldMember, date, db)
            } else {
                client.events.get('voc_join').execute(newMember, date, db)
                client.events.get('voc_left').execute(oldMember, date, db)
            }
        })
        db.query("SELECT voiceStateUpdate, logs_id FROM logs WHERE guild_id = ?", newMember.guild.id, async (err, rows) => {
            if (err) return console.log(err)
            if (rows.length === 0) return;
            for (let res of rows) {
                if (res.voiceStateUpdate) {
                    let chann = await newMember.guild.channels.cache.find(x => x.id === res.logs_id);
                    if (!chann) return;
                    let user = await newMember.guild.members.cache.find(x => x.id === newMember.id)
                    if (oldMember.channelId === null) {
                        let channVocal = await newMember.guild.channels.cache.find(x => x.id === newMember.channelId)
                        const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${user} a rejoint le salon vocal ${channVocal}** !\n\n**ID** : ${user.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return chann.send({embeds:[event]});
                    } else if (newMember.channelId === null) {
                        let channVocal = await newMember.guild.channels.cache.find(x => x.id === oldMember.channelId)
                        const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${user} a quitté le salon vocal ${channVocal}** !\n\n**ID** : ${user.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return chann.send({embeds:[event]});
                    } else {
                        let channVocal1 = await newMember.guild.channels.cache.find(x => x.id === newMember.channelId)
                        let channVocal2 = await newMember.guild.channels.cache.find(x => x.id === oldMember.channelId)
                        const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **${user} a été déplacé !\n\n> ${channVocal2} <a:LMT_arrow:1065548690862899240> ${channVocal1}\n\n**ID** : ${user.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return chann.send({embeds:[event]});
                    }
                }
            }
        })
    }
}      