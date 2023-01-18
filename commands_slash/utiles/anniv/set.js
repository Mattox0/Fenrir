const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        const dateF = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Merci de vérifier que votre date est au bon format :**> \`/anniv set JJ/MM\``)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        let dates = await interaction.options.getString('date');
        dates = dates.split('/');
        if (dates.length !== 2) return interaction.reply({embeds:[dateF],ephemeral:true});
        else if (!(dates[0] > 0 && dates[0] <= 31) || !(dates[1] > 0 && dates[1] <= 12)) return interaction.reply({embeds:[dateF],ephemeral:true});
        let listemois = ["janvier","février","mars","avril","mai","juin","juillet","aout","septembre","novembre","octobre","décembre"];
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Oui')
                    .setLabel('Ouais c\'est ça !')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('Non')
                    .setLabel('Non !')
                    .setStyle('DANGER'),
            )
        const ask = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> Ton anniversaire, c'est bien le **${dates[0]} ${listemois[parseInt(dates[1]) -1]}** ?`)
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
                        db.get("SELECT * FROM anniversaires WHERE user_id = ?",interaction.member.user.id, (err, res) => {
                            if (err) {console.log(err)}
                            let win = new MessageEmbed()
                                .setColor('#2f3136')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            if (!res || res.user_id === null) {
                                db.run("INSERT INTO anniversaires (user_id,date,guild_id) VALUES (?,?,?)",interaction.member.user.id,dates.join('/'),interaction.member.guild.id, (err) => {if (err) console.log(err)})
                                win.setDescription(`<a:LMT__arrow:831817537388937277> **Votre anniversaire a bien été enregistré !** <:LMT_Agg:882250214050775090>`)
                            } else {
                                db.run("UPDATE anniversaires SET date = ? WHERE user_id = ?",dates.join('/'),interaction.member.user.id, (err) => {if (err) console.log(err)})
                                win.setDescription(`<a:LMT__arrow:831817537388937277> **Votre anniversaire a bien été modifié !** <:LMT_Agg:882250214050775090>`)
                            }
                            return msg.edit({embeds:[win],components:[]});
                        })
                        break
                    case 'Non':
                        const non = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription('<a:LMT__arrow:831817537388937277> **Recommence !**')
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({ embeds : [non],components:[]});
                }
            })
        })
    }
}