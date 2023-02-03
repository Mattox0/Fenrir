const {EmbedBuilder} = require('discord.js')
let date = new Date()

module.exports = {
    name:'giveaways',
    description:'Check les entrées de giveaways',
    execute(...params) {
        let interraction = params[0]
        let db = params[3]
        db.get('SELECT * FROM giveaways WHERE message_id = ?',interraction.message.id, (err, result) => {
            if (err) {
                return console.log(err)
            }
            if (!result) return interraction.reply({content:`Ce giveaways est déjà fini !`,ephemeral:true})
            let participants = result.participants
            let nbParticipants
            let allParticipants
            if (participants) {
                nbParticipants = participants.split(' ').length
                allParticipants = participants.split(' ')
            } else {
                nbParticipants = 1
                allParticipants = []
            }
            if (!allParticipants.includes(interraction.member.id)) {
                if (participants) db.run('UPDATE giveaways SET participants = ? WHERE message_id = ?',`${participants} ${interraction.member.id}`,interraction.message.id, err => {if (err) console.log(err)})
                else db.run('UPDATE giveaways SET participants = ? WHERE message_id = ?',`${interraction.member.id}`,interraction.message.id, err => {if (err) console.log(err)})
                const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                .setDescription(`Organisé par <@${result.hostedBy}>\n\n**Fin le** <t:${result.duration}>\n\n**Nombre de gagnants :** ${result.winners}\n\n**Récompense :** ${result.prize}\n\n**Nombre de participants :** ${nbParticipants}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                interraction.update({embeds:[embed]})
            } else {
                interraction.reply({content:'Vous participez déjà à ce giveaway !', ephemeral:true})
            }
        })
    }
}