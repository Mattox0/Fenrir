const schedule = require('node-schedule');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name:'readygiveaways',
    description:'Refresh les giveaways',
    execute(...params) {
        let db = params[0];
        let client = params[1];
        db.query("SELECT * FROM giveaways", (err, rows) => {
            if (err) {
                return console.log(err);
            }
            for (let res of rows) {
                if (res.past === 1) {
                    let fin = new Date(res.duration * 1000);
                    let date = new Date();
                    diff = date - fin;
                    if (diff > 86400000) {
                        db.query('DELETE FROM giveaways WHERE message_id = ?', res.message_id, (err) => {
                            if (err) console.log(err);
                        });
                    } else {
                        date.setDate(date.getDate() + 1);
                        new schedule.scheduleJob(date, async function() {
                            db.query('DELETE FROM giveaways WHERE message_id = ?', res.message_id, (err) => {
                                if (err) console.log(err);
                            });
                        })
                    }
                } else {
                    let fin = new Date(res.duration * 1000)
                    let date = new Date()
                    if (date > fin) {
                        fin = date.setMinutes(date.getMinutes() + 1)
                    }
                    new schedule.scheduleJob(fin, async function() {
                        db.query('SELECT * FROM giveaways WHERE message_id = ?', res.message_id, async (err,rows2) => {
                            if (rows2 === 0) {
                                return 
                            }
                            for (let result of rows2) {
                                if (result.past === 1) {
                                    let fin = new Date(result.duration * 1000)
                                    fin.setDate(fin.getDate() + 1);
                                    new schedule.scheduleJob(fin, async function() {
                                        db.query('DELETE FROM giveaways WHERE message_id = ?',result.message_id, (err) => {
                                            if (err) console.log(err)
                                        })
                                    })
                                    return
                                }
                                let chann = await client.channels.fetch(result.channel_id)
                                let msg = await chann.messages.fetch(result.message_id)
                                const fail = new EmbedBuilder()
                                    .setColor('#2f3136')
                                    .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                                    .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                                    .setDescription(`Organisé par <@${res.hostedBy}>\n\n**Récompense :** ${res.prize}\n\n**Il n'y a eu aucun participants, pas de gagnant !**`)
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                if (!res.participants) {msg.edit({embeds:[fail],components:[]});msg.reply({content:`Il n'y a eu aucune participation, dommage !`})}
                                else {
                                    let participants = res.participants.split(' ');
                                    let gagnants = []
                                    for (let x = 0; x < res.winners;x++) {
                                        if (participants.length === 0) break
                                        let gagnant = participants[Math.floor(Math.random() * participants.length)]
                                        gagnants.push(gagnant)
                                        let index = participants.indexOf(gagnant);
                                        if (index > -1) participants.splice(index, 1);
                                    }
                                    const win = new EmbedBuilder()
                                        .setColor('#2f3136')
                                        .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                                        .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                                        .setDescription(`Organisé par <@${res.hostedBy}>\n\n**Récompense :** ${res.prize}\n\n**Gagnant(s) : <@${gagnants.join('>, <@')}>**`)
                                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                    msg.edit({embeds:[win],components:[]})
                                    gagnants.length > 1 ? gagne = 'gagnent' : gagne = 'gagne'
                                    msg.reply({content:`<a:LMT_fete2:911791997428334622> **<@${gagnants.join('>, <@')}> ${gagne} ${res.prize} ! Félicitations !** <a:LMT_fete2:911791997428334622>`}) 
                                }
                                db.query('UPDATE giveaways SET past = ? WHERE message_id = ?',[true,result.message_id], err => {
                                    if (err) console.log(err)
                                })
                                let fin = new Date(result.duration * 1000)
                                fin.setDate(fin.getDate() + 1);
                                new schedule.scheduleJob(fin, async function() {
                                    db.query('DELETE FROM giveaways WHERE message_id = ?',result.message_id, (err) => {
                                        if (err) console.log(err)
                                    })
                                })
                            }
                        })
                    })
                }
            }
        })
    }
}