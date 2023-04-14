const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let utilisateur = interaction.options.getUser('utilisateur');
        let fail;
        if (utilisateur) {
            utilisateur = await interaction.member.guild.members.cache.find(x => x.id === utilisateur.id);
            fail = new EmbedBuilder() 
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **${utilisateur} n'a pas encore créer son profil**\n\n> \`/profile edit\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        } else {
            utilisateur = interaction.member;
            fail = new EmbedBuilder() 
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Vous n\'avez pas encore créer votre profil !**\n\n> \`/profile edit\`')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        }
        db.query("SELECT * FROM profile WHERE user_id = ?", utilisateur.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) {
                return interaction.reply({embeds:[fail]});
            }
            res = res[0];
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
            res.likes = JSON.parse(res.likes)
            const view = new EmbedBuilder()
                .setColor(`#${res.couleur_hexa ? res.couleur_hexa : '2f3136'}`)
                .setAuthor({name:`${utilisateur.user.username} ・ ${res.likes.likes.length} ❤️`, iconURL:utilisateur.user.displayAvatarURL({dynamic: true})})
                .setThumbnail(`${res.image ? res.image : utilisateur.user.displayAvatarURL({dynamic: true})}`)
                .setFooter({text:`${res.footer ? res.footer : `LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`}`})
                .setDescription(`${res.description ? res.description : ''}\n\n${ res.pseudo ? `> \`Pseudo\` <a:LMT_arrow:1065548690862899240> ${res.pseudo}\n` : ''}${ res.film ? `> \`Film favoris\` <a:LMT_arrow:1065548690862899240> ${res.film}\n` : ''}${ res.musique ? `> \`Style musical\` <a:LMT_arrow:1065548690862899240> ${res.musique}\n` : ''}${res.couleur ? `> \`Couleur favorite\` <a:LMT_arrow:1065548690862899240> ${res.couleur}\n` : ''}${ res.repas ? `> \`Repas favoris\` <a:LMT_arrow:1065548690862899240> ${res.repas}\n` : ''}${res.adjectifs ? `> \`Personnalité\` <a:LMT_arrow:1065548690862899240> ${res.adjectifs}` : ''}`)
            return interaction.reply({embeds:[view], components:[row]});
        })
    }
}