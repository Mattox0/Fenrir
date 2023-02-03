const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        let id = interaction.options.getString('id');
        db.get("SELECT * FROM warns WHERE warn_id = ?",id, async (err, res) => {
            if (err || !res) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Je ne trouve pas la référence de ce warn**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            let person = await interaction.member.guild.members.cache.find(x => x.id === res.user_id);
            let modo = await interaction.member.guild.members.cache.find(x => x.id === res.modo_id);
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('Oui')
                        .setLabel('Oui !')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('Non')
                        .setLabel('Non !')
                        .setStyle(ButtonStyle.Danger)
                )
            const msg = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`${interaction.member}, etes vous sure de vouloir supprimer l'avertissement de ${person} ci dessous ?\n\n**Fautif:** ${person.user.username}#${person.user.discriminator} (\`${person.user.id}\`)\n**Modérateur:** ${modo.user.username}#${modo.user.discriminator}\n**Raison:** ${res.raison}\n**Date:** <t:${Math.ceil(new Date(res.warn_date) / 1000)}:F>`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await interaction.deferReply();
            interaction.editReply({embeds:[msg],components:[row]}).then(async msg => {
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
                            db.run("DELETE FROM warns WHERE warn_id = ?",id, (err) => {if (err) console.log(err)});
                            const win = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setDescription(`<a:LMT_arrow:1065548690862899240> **Le warn \`${id}\` a bien été supprimé !**`)
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
        })
        
    }
}