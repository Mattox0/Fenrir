const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.query("SELECT * FROM profile WHERE user_id = ?", interaction.member.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) {
                db.query("INSERT INTO profile(user_id, likes) VALUES (?, ?)", [interaction.member.id, JSON.stringify({ likes : []})],(err) => {if (err) console.log("profile edit -> ", err)});
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
                res = res[0];
                res.likes = JSON.parse(res.likes)
            }
            if (interaction.options.getString('description')) {
                description = interaction.options.getString('description').slice(0, 200)
                db.query("UPDATE profile SET description = ? WHERE user_id = ?", [description, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {description = res.description}
            if (interaction.options.getString('image')) {
                if (!isImgUrl(interaction.options.getString('image'))) {
                    const fail = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> **\`image\` n\'est pas dans le bon format \`ur\`**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.reply({embeds:[fail], ephemeral:true});
                }
                image = interaction.options.getString('image');
                db.query("UPDATE profile SET image = ? WHERE user_id = ?", [image, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {image = res.image}
            if (interaction.options.getString('footer')) {
                footer = interaction.options.getString('footer').slice(0, 50)
                db.query("UPDATE profile SET footer = ? WHERE user_id = ?", [footer, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {footer = res.footer}
            if (interaction.options.getString('couleur_hexa')) {
                if (!interaction.options.getString('couleur_hexa').match(/[0-9A-Fa-f]{6}/g)) {
                    const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **\`couleur_hexa\` n\'est pas dans le bon format \`hexadécimal\`**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.reply({embeds:[fail], ephemeral:true});
                }
                couleur_hexa = interaction.options.getString('couleur_hexa');
                db.query("UPDATE profile SET couleur_hexa = ? WHERE user_id = ?", [interaction.options.getString('couleur_hexa'), interaction.member.id], (err) => {if (err) console.log(err)});
            } else {couleur_hexa = res.couleur_hexa}
            if (interaction.options.getString('film')) {
                film = interaction.options.getString('film').slice(0, 50);
                db.query("UPDATE profile SET film = ? WHERE user_id = ?", [film, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {film = res.film}
            if (interaction.options.getString('musique')) {
                musique = interaction.options.getString('musique').slice(0, 50);
                db.query("UPDATE profile SET musique = ? WHERE user_id = ?", [musique, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {musique = res.musique}
            if (interaction.options.getString('couleur')) {
                couleur = interaction.options.getString('couleur').slice(0, 30);
                db.query("UPDATE profile SET couleur = ? WHERE user_id = ?", [couleur, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {couleur = res.couleur}
            if (interaction.options.getString('repas')) {
                repas = interaction.options.getString('repas').slice(0, 30);
                db.query("UPDATE profile SET repas = ? WHERE user_id = ?", [repas, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {repas = res.repas}
            if (interaction.options.getString('adjectifs')) {
                adjectifs = interaction.options.getString('adjectifs').slice(0, 50);
                db.query("UPDATE profile SET adjectifs = ? WHERE user_id = ?", [adjectifs, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {adjectifs = res.adjectifs}
            if (interaction.options.getString('pseudo')) {
                pseudo = interaction.options.getString('pseudo').slice(0, 30);
                db.query("UPDATE profile SET pseudo = ? WHERE user_id = ?", [pseudo, interaction.member.id], (err) => {if (err) console.log(err)});
            } else {pseudo = res.pseudo}
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`like_profile-${interaction.member.id}`)
                        .setLabel('Like')
                        .setEmoji('❤️')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`unlike_profile-${interaction.member.id}`)
                        .setLabel('Unlike')
                        .setEmoji('💔')
                        .setStyle(ButtonStyle.Danger)
                )
            const view = new EmbedBuilder()
                .setColor(`#${couleur_hexa ? couleur_hexa : '2f3136'}`)
                .setAuthor({name:`${interaction.member.user.username} ・ ${res.likes.likes.length} ❤️`, iconURL:interaction.member.user.displayAvatarURL({dynamic: true})})
                .setThumbnail(`${image ? image : interaction.member.user.displayAvatarURL({dynamic: true})}`)
                .setFooter({text:`${footer ? footer : `LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`}`})
                .setDescription(`${description ? description : ''}\n\n${ pseudo ? `> \`Pseudo\` <a:LMT_arrow:1065548690862899240> ${pseudo}\n` : ''}${ film ? `> \`Film favoris\` <a:LMT_arrow:1065548690862899240> ${film}\n` : ''}${ musique ? `> \`Style musical\` <a:LMT_arrow:1065548690862899240> ${musique}\n` : ''}${ couleur ? `> \`Couleur favorite\` <a:LMT_arrow:1065548690862899240> ${couleur}\n` : ''}${ repas ? `> \`Repas favoris\` <a:LMT_arrow:1065548690862899240> ${repas}\n` : ''}${adjectifs ? `> \`Personnalité\` <a:LMT_arrow:1065548690862899240> ${adjectifs}` : ''}`)
            return interaction.reply({content:`${interaction.member}, **Voici votre nouveau profil :**`,embeds:[view],components:[row]});
        })
    }
}

function isImgUrl(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url)
}