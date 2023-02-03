const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const schedule = require('node-schedule')

module.exports = {
	name: 'guildMemberAdd',
	async execute(...params) {
        let Member = params[0];
        let db = params[1];
        let date = new Date()
        if (Member.guild.id === "707953787477688360") {
            db.run("INSERT INTO reminderMember (user_id, startDate) VALUES (?,?)",Member.user.id, date, (err) => {if (err) console.log(err)});
            let dateFin = new Date()
            dateFin.setDate(dateFin.getDate() + 7);
            const end = new schedule.scheduleJob(dateFin, async function() {
                let person = await Member.guild.members.cache.find(x => x.id === Member.user.id);
                if (person) {
                    const remind = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setThumbnail('https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp')
                        .setFooter({text:`LMT-Bot ・ Merci de faire partie de cette magnifique communauté`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        .setDescription('<a:LMT_arrow:1065548690862899240> **Bonjour à toi !**\n\nCa fait une semaine que tu as rejoint le serveur de **La meute**\n\nNotre objectif est de fournir pour ses membres la meilleur expérience possible ainsi que des services de qualité.\n\n> N\'hésites pas à venir nous passer un petit coucou dans <#708012118619717783> !\n\n> Nous te remercions de faire partie de notre communauté !')
                    person.send({embeds:[remind]})
                }
                db.run('DELETE FROM reminderMember WHERE user_id = ?',Member.user.id, (err) => {if (err) console.log(err) })
            })
        }
        db.get("SELECT guildMemberAdd, logs_id FROM logs WHERE guild_id = ?",Member.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return;
            if (res.guildMemberAdd) {
                let chann = await Member.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                const event = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setThumbnail(Member.user.displayAvatarURL({dynamic:true}))
                    .setAuthor({name:`${Member.user.username}#${Member.user.discriminator}`, iconURL:`${Member.user.displayAvatarURL()}`})
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **${Member} a rejoint le serveur !**\n\n**Création du compte** : <t:${Math.ceil(Member.user.createdTimestamp / 1000)}:R>\n\n**ID** : ${Member.id}\n\n**Date :** <t:${Math.ceil(date / 1000)}:F>`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return chann.send({embeds:[event]});
            }
        })
    }
}      