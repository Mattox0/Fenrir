const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Oui')
                    .setLabel('Oui je suis sure !')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('Non')
                    .setLabel('Non !')
                    .setStyle(ButtonStyle.Danger)
            )
        const ask = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Souhaites-tu vraiment supprimer tous les warns du serveur ?**')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply()
        interaction.editReply({embeds:[ask],components:[row]}).then(async msg => {
            const filter = interraction => interraction.user.id == interaction.member.id && interraction.message.id == msg.id
            const collector = await msg.channel.createMessageComponentCollector({filter, max:1, time:60000})
            collector.on('end', collected => {
                if (!collected.first()) {
                    const fail = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> **Il faudrait se décider avant Noël !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]});
                }
                switch (collected.first().customId) {
                    case 'Oui':
                        db.query("DELETE FROM warns WHERE guild_id = ?",interaction.member.guild.id, (err) => {if (err) console.log(err)});
                        const win = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT_arrow:1065548690862899240> **Tous les warns du serveur ont été supprimés !**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({embeds:[win],components:[]});
                    case 'Non':
                        const non = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription('<a:LMT_arrow:1065548690862899240> **La demande a bien été annulée !**')
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({embeds:[non],components:[]});
                }
            })
        })

    }
}