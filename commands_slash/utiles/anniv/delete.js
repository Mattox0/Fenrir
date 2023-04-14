const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        db.query("SELECT * FROM anniversaires WHERE user_id = ?", interaction.member.user.id, async (err, res) => {
            if (err || res.length === 0) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Tu n\'as pas encore enregistré ton anniversaire !**')
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            res = res[0];
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Oui')
                    .setLabel('Oui je suis sûre')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('Non')
                    .setLabel('Non !')
                    .setStyle(ButtonStyle.Danger),
            )
            const ask = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> Souhaite-tu vraiment supprimer ton anniversaire ?`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await interaction.deferReply()
            interaction.editReply({embeds:[ask],components:[row]}).then(msg => {
                const filter = m => m.message.id === msg.id && m.user.id == interaction.member.user.id
                const collector = msg.channel.createMessageComponentCollector({ filter, max:1,time:60000})
                collector.on('end', async collected => {
                    if (!collected.first()) {
                        const delai = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription('<a:LMT_arrow:1065548690862899240> **Il faudrait se décider avant Noël.**')
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({ embeds: [delai], components: [] })
                    };
                    collected.first().deferUpdate(); // évite le chargement infinie de l'intérraction
                    switch (collected.first().customId) {
                        case 'Oui':
                            db.query("DELETE FROM anniversaires WHERE user_id = ?", interaction.member.user.id, (err) => {if (err) return console.log(err)});
                            const win = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setDescription(`<a:LMT_arrow:1065548690862899240> **Ton anniversaire a bien été supprimé !**`)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({embeds:[win],components:[]})
                        case 'Non':
                            const non = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setDescription('<a:LMT_arrow:1065548690862899240> **On a pas touché à ton anniversaire !**')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({ embeds : [non],components:[]});
                    }
                })
            })
        })
    }
}