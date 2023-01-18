const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

async function annonceRoles(interaction ,date, game, resolve) {
    // message village + stocké ID
    const village = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
    if (!village) {
        game.end = true;
        return resolve();
    }
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('role')
            .setLabel('Clique pour savoir ton rôle !')
            .setStyle('SUCCESS')
    );
    const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Bienvenue membres du village !\n\n> La partie va commencer, nous allons commencer par vous annoncer vos rôles !\n> Vous avez 30 secondes pour regarder votre rôle !\n> \`${game.allPlayersId.length} restants\``)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    await village.send({ embeds: [embed], components: [row]}).then(msg => {
        allIds = [];
        game.config.messageId = msg.id;
        const filter = interraction => interraction.message.id == msg.id;
        const collector = village.createMessageComponentCollector({ filter, time: 3000 });  //! 30000 A CHANGER
        collector.on("collect", async collected => {
            if (collected.customId == "role") {
                if (!game.allPlayersRoles.find(x => x.idPlayer === collected.user.id)) {
                    collected.reply({ content: `Tu ne fait pas partie du village.`, ephemeral: true });
                } else {
                    // stocké ID
                    if (!allIds.includes(collected.user.id)) {
                        allIds.push(collected.user.id);
                    }
                    // dire leur role
                    collected.reply({ content: `Tu es **${game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).name}**`, ephemeral: true });
                    // arreter le collector si tous a demandé le role
                    if (allIds.length >= game.allPlayersId.length) {
                        collector.stop();
                    }
                    embed.setDescription(`Bienvenue membres du village !\n\n> La partie va commencer, nous allons commencer par vous annoncer vos rôles !\n> Vous avez 30 secondes pour regarder votre rôle !\n> \`${game.allPlayersId.length - allIds.length} restants\``)
                    await msg.edit({ embeds: [embed], components: [row] });
                }
            }
        });
        collector.on("end", async collected => {
            if (allIds.length != game.allPlayersId.length) {
                count = game.allPlayersId.length - allIds.length;
                const noRoleEmbed = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`**${count}** personne${count > 1 ? 's' : ''} n'${count > 1 ? 'ont' : 'a'} pas demandé son rôle !\n\n> Tant pis pour elle${count > 1 ? 's' : ''} !`)
                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({ embeds: [noRoleEmbed], components: [] });
                resolve();
            } else {
                const SucceedRoleEmbed = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`Tous les joueurs ont vu leurs rôles !`)
                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({ embeds: [SucceedRoleEmbed], components: [] });
                resolve();
            }
        });
    });
}
module.exports = annonceRoles;
