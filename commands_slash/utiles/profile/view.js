const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let utilisateur = interaction.options.getUser('utilisateur');
        if (utilisateur) utilisateur = await interaction.member.guild.members.cache.find(x => x.id === utilisateur.id);
        else utilisateur = interaction.member
        db.get("SELECT * FROM profile WHERE user_id = ?", utilisateur.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) {
                const fail = new MessageEmbed() 
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Vous n\'avez pas encore créer votre profil !**\n\n> \`/profile edit\`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]});
            }
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('like_profile')
                        .setLabel('Like')
                        .setEmoji('❤️')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('unlike_profile')
                        .setLabel('Unlike')
                        .setEmoji('💔')
                        .setStyle('DANGER')
                )
            res.likes = JSON.parse(res.likes)
            const view = new MessageEmbed()
                .setColor(`#${res.couleur_hexa ? res.couleur_hexa : '2f3136'}`)
                .setAuthor({name:`${utilisateur.user.username} ・ ${res.likes.likes.length} ❤️`, iconURL:utilisateur.user.displayAvatarURL({dynamic: true})})
                .setThumbnail(`${res.image ? res.image : utilisateur.user.displayAvatarURL({dynamic: true})}`)
                .setFooter({text:`${res.footer ? res.footer : `LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`}`})
                .setDescription(`${res.description ? res.description : ''}\n\n${ res.pseudo ? `> \`Pseudo\` <a:LMT__arrow:831817537388937277> ${res.pseudo}\n` : ''}${ res.film ? `> \`Film favoris\` <a:LMT__arrow:831817537388937277> ${res.film}\n` : ''}${ res.musique ? `> \`Style musical\` <a:LMT__arrow:831817537388937277> ${res.musique}\n` : ''}${res.couleur ? `> \`Couleur favorite\` <a:LMT__arrow:831817537388937277> ${res.couleur}\n` : ''}${ res.repas ? `> \`Repas favoris\` <a:LMT__arrow:831817537388937277> ${res.repas}\n` : ''}${res.adjectifs ? `> \`Personnalité\` <a:LMT__arrow:831817537388937277> ${res.adjectifs}` : ''}`)
            return interaction.reply({content:`${utilisateur}, **Voici ton profil :**`,embeds:[view], components:[row]});
        })
    }
}