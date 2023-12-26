const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        const dateF = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Merci de vérifier que votre date est au bon format :**> \`/anniv set JJ/MM\``)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        let dates = await interaction.options.getString('date');
        dates = dates.split('/');
        if (dates.length !== 2) return interaction.reply({embeds:[dateF],ephemeral:true});
        else if (!(dates[0] > 0 && dates[0] <= 31) || !(dates[1] > 0 && dates[1] <= 12)) return interaction.reply({embeds:[dateF],ephemeral:true});
        let listemois = ["janvier","février","mars","avril","mai","juin","juillet","aout","septembre","novembre","octobre","décembre"];
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Oui')
                    .setLabel('Ouais c\'est ça !')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('Non')
                    .setLabel('Non !')
                    .setStyle(ButtonStyle.Danger),
            )
        const ask = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> Ton anniversaire, c'est bien le **${dates[0]} ${listemois[parseInt(dates[1]) -1]}** ?`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply()
        interaction.editReply({embeds:[ask],components:[row]}).then(msg => {
            const filter = m => m.message.id === msg.id && m.user.id == interaction.member.user.id;
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
                        db.query("SELECT * FROM anniversaires WHERE user_id = ?", interaction.member.user.id, (err, res) => {
                            if (err) {console.log(err)}
                            let win = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            if (res.length === 0 || res[0].user_id === null) {
                                db.query("INSERT INTO anniversaires (user_id,date) VALUES (?,?)", [interaction.member.user.id,dates.join('/')], (err) => {if (err) console.log(err)})
                                win.setDescription(`<a:LMT_arrow:1065548690862899240> **Votre anniversaire a bien été enregistré !** <:LMT_gg:1081997432986009721>`)
                            } else {
                                db.query("UPDATE anniversaires SET date = ? WHERE user_id = ?", [dates.join('/'),interaction.member.user.id], (err) => {if (err) console.log(err)})
                                win.setDescription(`<a:LMT_arrow:1065548690862899240> **Votre anniversaire a bien été modifié !** <:LMT_gg:1081997432986009721>`)
                            }
                            return msg.edit({embeds:[win],components:[]});
                        })
                        break;
                    case 'Non':
                        const non = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription('<a:LMT_arrow:1065548690862899240> **Recommence !**')
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({ embeds : [non],components:[]});
                }
            })
        })
    }
}