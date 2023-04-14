const {EmbedBuilder} = require('discord.js');
const { cos } = require('mathjs');
let date = new Date()

module.exports = {
    name:'giveaways_remove',
    description:'Check les entrées de giveaways',
    execute(...params) {
        let interraction = params[0];
        let db = params[3];
        db.query('SELECT * FROM giveaways WHERE message_id = ?', interraction.message.id, (err, result) => {
            if (err) {
                return console.log(err);
            }
            if (result.length === 0) return interraction.reply({content:`Ce giveaways est déjà fini !`,ephemeral:true});
            result = result[0];
            let participants = result.participants;
            if (!participants) interraction.reply({content:`Il n'y as pas de participants !`,ephemeral:true});
            let allParticipants = participants.split(' ');
            if (!allParticipants.includes(interraction.member.id)) {
                interraction.reply({content:'Vous ne participez pas à ce giveaway !', ephemeral:true});
            } else {
                let index = participants.indexOf(interraction.member.id);
                if (index > -1) {
                    allParticipants.splice(index, 1);
                }
                let nbParticipants = allParticipants.length;
                db.query('UPDATE giveaways SET participants = ? WHERE message_id = ?', [allParticipants.join(' '),result.message_id], (err) => {if (err) console.log(err)})
                const embed = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle('Giveaway <a:LMT_fete2:911791997428334622>')
                    .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/911778659604500510/831817670822723597.gif')
                    .setDescription(`Organisé par <@${result.hostedBy}>\n\n**Fin le** <t:${result.duration}>\n\n**Nombre de gagnants :** ${result.winners}\n\n**Récompense :** ${result.prize}\n\n**Nombre de participants :** ${nbParticipants}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                interraction.update({embeds:[embed]})
            }
        })
    }
}