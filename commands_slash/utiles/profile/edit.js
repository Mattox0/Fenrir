const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.get("SELECT * FROM profile WHERE user_id = ?", interaction.member.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) {
                await db.run("INSERT INTO profile(user_id, likes) VALUES (?, ?)", interaction.member.id, JSON.stringify({ likes : []}),(err) => {if (err) console.log("8", err)});
                res = {
                    user_id : interaction.member.id,
                    description : null,
                    image : null,
                    footer : null,
                    couleur_hexa : null,
                    film : null,
                    musique : null,
                    couleur : null,
                    repas : null,
                    adjectifs : null,
                    pseudo : null,
                    likes : { likes : [] }
                }
            } else {
                res.likes = JSON.parse(res.likes)
            }
            if (interaction.options.getString('description')) {
                db.run("UPDATE profile SET description = ? WHERE user_id = ?", interaction.options.getString('description'), interaction.member.id, (err) => {if (err) console.log(err)});
                description = interaction.options.getString('description')
            } else {description = res.description}
            if (interaction.options.getString('image')) {
                db.run("UPDATE profile SET image = ? WHERE user_id = ?", interaction.options.getString('image'), interaction.member.id, (err) => {if (err) console.log(err)});
                image = interaction.options.getString('image');
            } else {image = res.image}
            if (interaction.options.getString('footer')) {
                db.run("UPDATE profile SET footer = ? WHERE user_id = ?", interaction.options.getString('footer'), interaction.member.id, (err) => {if (err) console.log(err)});
                footer = interaction.options.getString('footer');
            } else {footer = res.footer}
            if (interaction.options.getString('couleur_hexa')) {
                if (interaction.options.getString('couleur_hexa').length !== 6) {
                    const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **\`couleur_hexa\` n\'est pas dans le bon format (hexadécimal)**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.reply({embeds:[fail], ephemeral:true});
                }
                db.run("UPDATE profile SET couleur_hexa = ? WHERE user_id = ?", interaction.options.getString('couleur_hexa'), interaction.member.id, (err) => {if (err) console.log(err)});
                couleur_hexa = interaction.options.getString('couleur_hexa');
            } else {couleur_hexa = res.couleur_hexa}
            if (interaction.options.getString('film')) {
                db.run("UPDATE profile SET film = ? WHERE user_id = ?", interaction.options.getString('film'), interaction.member.id, (err) => {if (err) console.log(err)});
                film = interaction.options.getString('film');
            } else {film = res.film}
            if (interaction.options.getString('musique')) {
                db.run("UPDATE profile SET musique = ? WHERE user_id = ?", interaction.options.getString('musique'), interaction.member.id, (err) => {if (err) console.log(err)});
                musique = interaction.options.getString('musique');
            } else {musique = res.musique}
            if (interaction.options.getString('couleur')) {
                db.run("UPDATE profile SET couleur = ? WHERE user_id = ?", interaction.options.getString('couleur'), interaction.member.id, (err) => {if (err) console.log(err)});
                couleur = interaction.options.getString('couleur');
            } else {couleur = res.couleur}
            if (interaction.options.getString('repas')) {
                db.run("UPDATE profile SET repas = ? WHERE user_id = ?", interaction.options.getString('repas'), interaction.member.id, (err) => {if (err) console.log(err)});
                repas = interaction.options.getString('repas');
            } else {repas = res.repas}
            if (interaction.options.getString('adjectifs')) {
                db.run("UPDATE profile SET adjectifs = ? WHERE user_id = ?", interaction.options.getString('adjectifs'), interaction.member.id, (err) => {if (err) console.log(err)});
                adjectifs = interaction.options.getString('adjectifs');
            } else {adjectifs = res.adjectifs}
            if (interaction.options.getString('pseudo')) {
                db.run("UPDATE profile SET pseudo = ? WHERE user_id = ?", interaction.options.getString('pseudo'), interaction.member.id, (err) => {if (err) console.log(err)});
                pseudo = interaction.options.getString('pseudo');
            } else {pseudo = res.pseudo}
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
            const view = new MessageEmbed()
                .setColor(`#${couleur_hexa ? couleur_hexa : '2f3136'}`)
                .setAuthor({name:`${interaction.member.user.username} ・ ${res.likes.likes.length} ❤️`, iconURL:interaction.member.user.displayAvatarURL({dynamic: true})})
                .setThumbnail(`${image ? image : interaction.member.user.displayAvatarURL({dynamic: true})}`)
                .setFooter({text:`${footer ? footer : `LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`}`})
                .setDescription(`${description ? description : ''}\n\n${ pseudo ? `> \`Pseudo\` <a:LMT__arrow:831817537388937277> ${pseudo}\n` : ''}${ film ? `> \`Film favoris\` <a:LMT__arrow:831817537388937277> ${film}\n` : ''}${ musique ? `> \`Style musical\` <a:LMT__arrow:831817537388937277> ${musique}\n` : ''}${ couleur ? `> \`Couleur favorite\` <a:LMT__arrow:831817537388937277> ${couleur}\n` : ''}${ repas ? `> \`Repas favoris\` <a:LMT__arrow:831817537388937277> ${repas}\n` : ''}${adjectifs ? `> \`Personnalité\` <a:LMT__arrow:831817537388937277> ${adjectifs}` : ''}`)
            return interaction.reply({content:`${interaction.member}, **Voici votre nouveau profil :**`,embeds:[view],components:[row]});
        })
    }
}