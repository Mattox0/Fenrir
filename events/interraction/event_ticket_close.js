const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');
let date = new Date()

module.exports = {
    name:'ticket_close',
    description:'Ferme un ticket',
    async execute(...params) {
        let interaction = params[0];
        let db = params[3];
        db.get("SELECT * FROM tickets WHERE channel_id = ?",interaction.channelId, async (err, res) => {
            if (err || !res) {
                return interaction.reply({content:'il y a eu une erreur...', ephemeral:true});
            }
            if (res.deleted === 1) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Le ticket est deja fermé !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            chann = await interaction.member.guild.channels.cache.find(channel => channel.id === res.channel_id);
            chann.permissionOverwrites.edit(res.user_id, {VIEW_CHANNEL:false});
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ticket_save')
                        .setLabel('📄 Sauvegarder')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('ticket_reopen')
                        .setLabel('🔓 Ouvrir')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('ticket_delete')
                        .setLabel('⛔ Supprimer')
                        .setStyle('DANGER')
                )
            const embed = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`Le ticket a été fermé par ${interaction.member} !\n\n**__Que voulez vous faire ?__**\n\n> 📄 Sauvegarder la conversation\n> 🔓 Ré-ouvrir la conversation\n> ⛔ Supprimer le ticket`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            chann.send({embeds:[embed],components:[row]});
            chann.setName(chann.name.replace('ticket','closed'));
            db.run('UPDATE tickets SET deleted = 1 WHERE channel_id = ?', res.channel_id, (err) => {if (err) console.log(err)});
            interaction.deferUpdate()
        })
    }
}