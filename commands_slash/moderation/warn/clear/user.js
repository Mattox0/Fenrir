const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        let person = interaction.options.getUser('utilisateur');
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Oui')
                    .setLabel('Oui je suis sure !')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('Non')
                    .setLabel('Non !')
                    .setStyle('DANGER')
            )
        const ask = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Souhaites-tu vraiment supprimer tous les warns de ${person} ?**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply()
        interaction.editReply({embeds:[ask],components:[row]}).then(msg => {
            const filter = interraction => interraction.user.id == interaction.member.id && interraction.message.id == msg.id
            const collector = await msg.channel.createMessageComponentCollector({filter, max:1, time:60000})
            collector.on('end', collected => {
                if (!collected.first()) {
                    const fail = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT__arrow:831817537388937277> **Il faudrait se décider avant Noël !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]});
                }
                switch (collected.first().customId) {
                    case 'Oui':
                        db.run("DELETE FROM warns WHERE guild_id = ? AND user_id = ?",interaction.member.guild.id, person.user.id, (err) => {if (err) console.log(err)});
                        const win = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT__arrow:831817537388937277> **Tous les warns de ${person} ont été supprimés !**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({embeds:[win],components:[]});
                    case 'Non':
                        const non = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription('<a:LMT__arrow:831817537388937277> **La demande a bien été annulée !**')
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({embeds:[non],components:[]});
                }
            })
        })

    }
}