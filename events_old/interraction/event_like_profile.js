const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
let date = new Date()

module.exports = {
    name:'like_profile',
    description:'Check les likes des profils',
    async execute(...params) {
        let interaction = params[0]
        let db = params[3]
        let id = interaction.customId.split('-')[1];
        let member = await interaction.member.guild.members.cache.find(x => x.id === id);
        if (!member) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Cette personne ne fais plus partie du serveur...**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail], ephemeral:true});
        }
        db.query('SELECT * FROM profile WHERE user_id = ?', member.user.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Cette personne ne fais plus partie du serveur...**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail], ephemeral:true});
            }
            res = res[0];
            res.likes = JSON.parse(res.likes);
            if (res.likes.likes.includes(interaction.user.id)) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu as déjà like cette personne !**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail], ephemeral:true});
            } else {
                res.likes.likes.push(interaction.user.id);
                db.query('UPDATE profile SET likes = ? WHERE user_id = ?', [JSON.stringify(res.likes), member.user.id], (err) => {if (err) console.log(err) });
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`like_profile-${member.user.id}`)
                            .setLabel('Like')
                            .setEmoji('❤️')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`unlike_profile-${member.user.id}`)
                            .setLabel('Unlike')
                            .setEmoji('💔')
                            .setStyle(ButtonStyle.Danger)
                    )
                const view = new EmbedBuilder()
                    .setColor(`#${res.couleur_hexa ? res.couleur_hexa : '2f3136'}`)
                    .setAuthor({name:`${member.user.username} ・ ${res.likes.likes.length} ❤️`, iconURL:member.user.displayAvatarURL({dynamic: true})})
                    .setThumbnail(`${res.image ? res.image : member.user.displayAvatarURL({dynamic: true})}`)
                    .setFooter({text:`${res.footer ? res.footer : `LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`}`})
                    .setDescription(`${res.description ? res.description : ''}\n\n${ res.pseudo ? `> \`Pseudo\` <a:LMT_arrow:1065548690862899240> ${res.pseudo}\n` : ''}${ res.film ? `> \`Film favoris\` <a:LMT_arrow:1065548690862899240> ${res.film}\n` : ''}${ res.musique ? `> \`Style musical\` <a:LMT_arrow:1065548690862899240> ${res.musique}\n` : ''}${res.couleur ? `> \`Couleur favorite\` <a:LMT_arrow:1065548690862899240> ${res.couleur}\n` : ''}${ res.repas ? `> \`Repas favoris\` <a:LMT_arrow:1065548690862899240> ${res.repas}\n` : ''}${res.adjectifs ? `> \`Personnalité\` <a:LMT_arrow:1065548690862899240> ${res.adjectifs}` : ''}`)
                await interaction.message.edit({content:`${member}, **Voici ton profil :**`,embeds:[view], components:[row]});
                await interaction.deferUpdate()
            }

        })
    }
}