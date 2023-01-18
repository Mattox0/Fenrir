const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const schedule = require("node-schedule")

module.exports = {
    async execute(interaction, db, date, client) {
        let channel = interaction.options.getChannel('channel')
        if (channel.type !== "GUILD_TEXT") {
            const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Le salon doit être __textuel__ !**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true});
        }
        let temps = interaction.options.getString('temps')
        let prize = interaction.options.getString('récompense')
        let winners = interaction.options.getInteger('winners')
        const failTime = new MessageEmbed()
        .setColor(`#2f3136`)
        .setDescription(`<a:LMT__arrow:831817537388937277> **Merci de mettre un temps correct**\n\n> 2d5h30m (\`2 jours, 5 heures et 30 minutes\`)\n> 2d (\`2 jours\`)`)
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        let time = "";let day=0;let heure = 0; let minute = 0;
        let dateFin = new Date();
        for (x of temps) {
            if (x === 'd') {day = time.replace(/[^0-9]/g, '');time ="";if (day=="") return interaction.reply({embeds:[failTime],ephemeral:true});continue}
            if (x === "h") {heure = time.replace(/[^0-9]/g, '');time="";if (heure=="") return interaction.reply({embeds:[failTime],ephemeral:true});continue}
            if (x === "m") {minute = time.replace(/[^0-9]/g, '');time="";if (minute=="") return interaction.reply({embeds:[failTime],ephemeral:true});continue}
            time += x
        }
        if (time != "") return interaction.reply({embeds:[failTime],ephemeral:true})
        if (day>0) dateFin.setDate(dateFin.getDate() + parseInt(day));
        if (heure>0) dateFin.setHours(dateFin.getHours() + parseInt(heure));
        if (minute>0) dateFin.setMinutes(dateFin.getMinutes() + parseInt(minute))
        const failWinners = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription('<a:LMT__arrow:831817537388937277> **Merci de mettre un nombre de gagnant correct !**\n\n> \`Entre de 1 et 20 maximum\`')
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (!winners) winners = 1;
        else {
            if (winners > 21 || winners < 1) return interaction.reply({embeds:[failWinners],ephemeral:true});
        }
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Oui')
                    .setLabel('On garde ça')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('Non')
                    .setLabel('Je recommence !')
                    .setStyle('DANGER')
            )
        const All = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`<a:LMT__arrow:831817537388937277> **Tout est bon pour toi ?**\n\n<:LMT__point:879168876968026173> __Salon__ : ${channel}\n<:LMT__point:879168876968026173> __Le__ : <t:${Math.round(+dateFin/1000)}>\n<:LMT__point:879168876968026173> __Gagnants__ : ${winners}\n<:LMT__point:879168876968026173> __Récompense__ : ${prize}`)
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply();
        interaction.editReply({embeds:[All],components:[row]}).then(msg => {
            const filter = interraction => interraction.user.id == interaction.member.user.id && interraction.message.id == msg.id
            const collector = msg.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 60000
            })
            collector.on('end', async collected => {
                if (!collected.first()) {
                    const delai = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT__arrow:831817537388937277> **Il faudrait se décider avant Noël.**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({ embeds: [delai], components: [] })
                };
                collected.first().deferUpdate(); // évite le chargement infinie de l'intérraction
                switch (collected.first().customId) {
                    case 'Oui':
                        const win = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT__arrow:831817537388937277> **Giveaway envoyé avec succès !** :white_check_mark:`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({embeds:[win],components:[]})
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('giveaways')
                                    .setLabel('Je participe !')
                                    .setStyle('SUCCESS'),
                                new MessageButton()
                                    .setCustomId('giveaways_remove')
                                    .setLabel('Je souhaite me désinscrire')
                                    .setStyle('DANGER')
                            )
                        const giveaway = new MessageEmbed()
                            .setColor('#2f3136')
                            .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                            .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                            .setDescription(`Organisé par ${interaction.member}\n\n**Fin le :** <t:${Math.round(+dateFin/1000)}>\n\n**Nombre de gagnant(s) :** ${winners}\n\n**Récompense :** ${prize}\n\n**Nombre de participant(s) :** 0`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        const msggiveaway = await channel.send({embeds:[giveaway],components:[row]})
                        db.run('INSERT INTO giveaways(message_id,channel_id,winners,prize,duration,hostedBy,past,guild_id) VALUES (?,?,?,?,?,?,?,?)',msggiveaway.id,msggiveaway.channel.id,winners,prize,Math.round(+dateFin/1000),interaction.member.user.id,false,interaction.member.guild.id, err => {if (err) console.log(err)})
                        new schedule.scheduleJob(dateFin, async function() {
                            db.get('SELECT * FROM giveaways WHERE message_id = ?',msggiveaway.id, async (err, res) => {
                                if (!res) return
                                if (res.past === 1) {
                                    let fin = new Date(res.duration * 1000)
                                    fin.setDate(fin.getDate() + 1);
                                    new schedule.scheduleJob(fin, async function() {
                                        db.run('DELETE FROM giveaways WHERE message_id = ?',result.message_id, (err) => {
                                            if (err) console.log(err)
                                        })
                                    })
                                    return
                                }
                                let chann = await client.channels.fetch(res.channel_id)
                                let msg = await chann.messages.fetch(res.message_id)
                                if (res.participants === null) {
                                    const fail = new MessageEmbed()
                                        .setColor('#2f3136')
                                        .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                                        .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                                        .setDescription(`Organisé par <@${res.hostedBy}>\n\n**Récompense :** ${res.prize}\n\n**Il n'y a eu aucun participant, pas de gagnant !**`)
                                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                    msg.edit({embeds:[fail],components:[]})
                                    msg.reply({content:`Il n'y a eu aucune participation, dommage !`})
                                } else {
                                    let participants = res.participants.split(' ')
                                    let gagnants = []
                                    for (let x = 0; x < res.winners;x++) {
                                        if (participants.length === 0) break
                                        let gagnant = participants[Math.floor(Math.random() * participants.length)]
                                        gagnants.push(gagnant)
                                        let index = participants.indexOf(gagnant);
                                        if (index > -1) participants.splice(index, 1);
                                    }
                                    const win = new MessageEmbed()
                                        .setColor('#2f3136')
                                        .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                                        .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                                        .setDescription(`Organisé par <@${res.hostedBy}>\n\n**Récompense :** ${res.prize}\n\n**Gagnants : <@${gagnants.join('>, <@')}>**`)
                                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                    msg.edit({embeds:[win],components:[]})
                                    gagnants.length > 1 ? gagne = 'gagnent' : gagne = 'gagne'
                                    msg.reply({content:`<a:LMT_fete2:911791997428334622> **<@${gagnants.join('>, <@')}> ${gagne} ${res.prize} ! Félicitations !** <a:LMT_fete2:911791997428334622>`})
                                }
                                db.run('UPDATE giveaways SET past = ? WHERE message_id = ?',true,res.message_id, err => {
                                    if (err) console.log(err)
                                })
                                let fin = new Date(res.duration * 1000)
                                fin.setDate(fin.getDate() + 1);
                                new schedule.scheduleJob(fin, async function() {
                                    db.run('DELETE FROM giveaways WHERE message_id = ?',res.message_id, (err) => {
                                        if (err) console.log(err)
                                    })
                                })
                            })
                        })
                        break
                    case 'Non':
                        const fail = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT__arrow:831817537388937277> **Le giveaway a bien été annulé !**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({embeds:[fail],components:[]})
                }
            })
        })
    }
}