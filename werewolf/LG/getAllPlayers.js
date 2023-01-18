const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

async function getAllPlayers(interaction, date, game, resolve) {
    let players = [];
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('join')
            .setLabel('Rejoindre')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('leave')
            .setLabel('Quitter')
            .setStyle('DANGER'),
        new MessageButton()
            .setCustomId('start')
            .setLabel('Lancer la partie')
            .setStyle('PRIMARY')
    )
    const collect = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription("Le village de Thiercelieux est maintenant ouvert !\n\n**Habitants** :\n\n> *Le village est désert*")
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    await interaction.editReply({embeds:[collect], components:[row]}).then(msg => {
        const filter = interraction => interraction.message.id == msg.id;
        const collector = msg.channel.createMessageComponentCollector({
            filter,
            time: 60000
        })
        collector.on("collect", async collected => {
            if (collected.customId == "join") {
                if (!players.includes(collected.user.id)) {
                    players.push(collected.user.id);
                    const newEmbed = msg.embeds[0];
                    newEmbed.setDescription(`Le village de Thiercelieux est maintenant ouvert !\n\n**Habitants** :\n\n> ${players.map(player => `<@${player}>`).join("\n> ")}`);
                    await msg.edit({embeds:[newEmbed]});
                    await collected.deferUpdate();
                } else {
                    collected.reply({content:"Vous faites déjà partie du village !", ephemeral:true});
                }
            } else if (collected.customId == "leave") {
                if (players.includes(collected.user.id)) {
                    players.splice(players.indexOf(collected.user.id), 1);
                    const newEmbed = msg.embeds[0];
                    newEmbed.setDescription(`Le village de Thiercelieux est maintenant ouvert !\n\n**Habitants** :\n\n> ${players.map(player => `<@${player}>`).join("\n> ")}`);
                    await msg.edit({embeds:[newEmbed]});
                    await collected.deferUpdate();
                } else {
                    collected.reply({content:"Vous ne faites pas partie du village !", ephemeral:true});
                }
            } else if (collected.customId == "start") {
                if (collected.user.id == interaction.user.id) {
                    if (players.length >= 4) { // 4 minimum
                        game.allPlayersId = players;
                        await collected.deferUpdate();
                        collector.stop();
                    } else {
                        collected.reply({content:"Il n'y a pas assez de joueurs ! `4 minimum`", ephemeral:true});
                    }
                } else {
                    collected.reply({content:"Vous n'êtes pas l'hôte de la partie", ephemeral:true});
                }
            }
        })
        collector.on('end', async collected => {
            if (players.length >= 4) {
                game.config.firstMsg = msg.id;
                game.allPlayersId = players;
                const finishMessage = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`La partie va commencer !\n\n**Habitants** :\n\n> ${players.map(player => `<@${player}>`).join("\n> ")}`)
                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({embeds:[finishMessage],components:[]});
                resolve();
            } else {
                game.end = true
                const finishMessage = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription("Le village de Thiercelieux est maintenant fermé !\n\nIl n'y a pas assez de joueurs pour commencer la partie !")
                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({embeds:[finishMessage], components:[]});
                resolve();
            }
        })
    })
}
module.exports = getAllPlayers;