const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const schedule = require("node-schedule")

module.exports = {
    async execute(interaction, db, date, client) {
        let message_id = interaction.options.getString('message_id')
        db.get('SELECT * FROM giveaways WHERE message_id = ?',message_id, async (err,res) => {
            if (err || !res) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Ce message ne corresponds pas à un giveaway actif**\n\n> \`/giveaway end <ID>\`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            let chann = await client.channels.fetch(res.channel_id)
            let msg = await chann.messages.fetch(res.message_id)
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                .setDescription(`Organisé par <@${res.hostedBy}>\n\n**Récompense :** ${res.prize}\n\n**Il n'y a eu aucun participants, pas de gagnant !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            if (!res.participants) {msg.edit({embeds:[fail],components:[]});interaction.reply({content:`Il n'y a eu aucune participation, dommage !`})}
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
                    .setDescription(`Organisé par <@${res.hostedBy}>\n\n**Récompense :** ${res.prize}\n\n**Gagnants : <@${gagnants.join('>, <@')}>**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                msg.edit({embeds:[win],components:[]})
                gagnants.length > 1 ? gagne = 'gagnent' : gagne = 'gagne'
                interaction.reply({content:`<a:LMT_fete2:911791997428334622> **<@${gagnants.join('>, <@')}> ${gagne} ${res.prize} ! Félicitations !** <a:LMT_fete2:911791997428334622>`}) 
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
    }
}