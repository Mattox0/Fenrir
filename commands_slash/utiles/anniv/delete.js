const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        db.get("SELECT * FROM anniversaires WHERE user_id = ?",interaction.member.user.id, async (err, res) => {
            if (err || !res) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    .setDescription('<a:LMT__arrow:831817537388937277> **Tu n\'as pas encore enregistré ton anniversaire !**')
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Oui')
                    .setLabel('Oui je suis sûre')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('Non')
                    .setLabel('Non !')
                    .setStyle('DANGER'),
            )
            const ask = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> Souhaite-tu vraiment supprimer ton anniversaire ?`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await interaction.deferReply()
            interaction.editReply({embeds:[ask],components:[row]}).then(msg => {
                const filter = m => m.message.id === msg.id && m.user.id == interaction.member.user.id
                const collector = msg.channel.createMessageComponentCollector({ filter, max:1,time:60000})
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
                            db.run("DELETE FROM anniversaires WHERE user_id = ?",interaction.member.user.id, (err) => {if (err) return console.log(err)});
                            const win = new MessageEmbed()
                                .setColor('#2f3136')
                                .setDescription(`<a:LMT__arrow:831817537388937277> **Ton anniversaire a bien été supprimé !**`)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({embeds:[win],components:[]})
                        case 'Non':
                            const non = new MessageEmbed()
                                .setColor('#2f3136')
                                .setDescription('<a:LMT__arrow:831817537388937277> **On a pas touché à ton anniversaire !**')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({ embeds : [non],components:[]});
                    }
                })
            })
        })
    }
}