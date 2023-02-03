const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	name: 'guildMemberUpdate',
	async execute(...params) {
        let oldMember = params[0];
        let newMember = params[1];
        let db = params[2];
        let date = new Date()
        db.get("SELECT guildMemberUpdate, logs_id FROM logs WHERE guild_id = ?",newMember.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return;
            if (res.guildMemberUpdate) {
                let chann = await newMember.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                if (oldMember.nickname !== newMember.nickname) {
                    const event = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Le surnom de ${newMember} a été modifié** !\n\n**ID** : ${newMember.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>\n\n> **Pseudo** : \`${oldMember.nickname ? oldMember.nickname : oldMember.user.username}\` <a:LMT_arrow:1065548690862899240> ${newMember.nickname ? newMember.nickname : newMember.user.username}`)
                    return chann.send({embeds:[event]})
                }
                if (oldMember._roles !== newMember._roles) {
                    let difference1 = oldMember._roles.filter(x => !newMember._roles.includes(x));
                    let difference2 = newMember._roles.filter(x => !oldMember._roles.includes(x));
                    if (difference2.length !== 0) {
                        let role = await oldMember.guild.roles.cache.find(x => x.id === difference2[0])
                        if (role) {
                            const event = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                .setDescription(`<a:LMT_arrow:1065548690862899240> **${newMember} a reçu le rôle ${role.name}** !\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                            return chann.send({embeds:[event]})
                        }
                    } else {
                        let role = await oldMember.guild.roles.cache.find(x => x.id === difference1[0])
                        if (role) {
                            const event = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                .setDescription(`<a:LMT_arrow:1065548690862899240> **${newMember} a été retiré du rôle ${role.name}** !\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                            return chann.send({embeds:[event]})
                        }
                    }
                }
            }
        })
    }
}      