const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, db, date, client) {
        let message_id = interaction.options.getString('message_id');
        db.get('SELECT * FROM giveaways WHERE message_id = ?',message_id, (err, res) => {
            if (!res || err) {
                const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Le message ne represente aucun giveaway actif !**\n\n> /giveaway cancel <ID>`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return message.channel.send({embeds:[fail]})
            }
            if (res.past === 1) {
                const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Le giveaways est déjà fini !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return message.channel.send({embeds:[fail]})
            }
            let chann = await client.channels.fetch(res.channel_id)
            let msg = await chann.messages.fetch(res.message_id)
            db.run('DELETE FROM giveaways WHERE message_id = ?',res.message_id, (err) => {
                if (err) console.log(err)
            })
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Le giveaway a été annulé !**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            msg.edit({embeds:[win]})
            return interaction.reply({content:'Le giveaway a été annulé !'});
        })
    }
}