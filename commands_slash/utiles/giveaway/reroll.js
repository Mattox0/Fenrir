const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const schedule = require("node-schedule")

module.exports = {
    async execute(interaction, db, date, client) {
        let message_id = interaction.options.getString('message_id');
        db.get('SELECT * FROM giveaways WHERE message_id = ?',message_id, (err, res) => {
            if (!res) {
                const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Ce message n'a pas de giveaway actif**\n\n> /giveaway reroll <ID>`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            if (res.past !== 1) {
                const failZ = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Le giveaway n'est pas fini !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return message.channel.send({embeds:[failZ],ephemeral:true});
            }
            if (!res.participants) {interaction.reply({content:`Il n'y a eu toujours pas eu de participations, dommage !`,ephemeral:true});return}
            let participants = res.participants.split(' ');
            let gagnants = [];
            for (let x = 0; x < res.winners;x++) {
                if (participants.length === 0) break
                let gagnant = participants[Math.floor(Math.random() * participants.length)]
                gagnants.push(gagnant)
                let index = participants.indexOf(gagnant);
                if (index > -1) participants.splice(index, 1);
            }
            gagnants.length > 1 ? gagne = 'gagnent' : gagne = 'gagne'
            interaction.reply({content:`<a:LMT_fete2:911791997428334622> **<@${gagnants.join('>, <@')}> ${gagne} ${res.prize} ! Félicitations !** <a:LMT_fete2:911791997428334622>`});
        })
    }
}