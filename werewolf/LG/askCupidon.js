const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const lock = require("./lock.js");

async function askCupidon(interaction ,date, game, resolve) {
    // modif message village
    const village = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
    const category = await interaction.guild.channels.cache.find(channel => channel.id === game.config.categoryId);
    if (!village || !category) {
        game.end = true;
        return resolve();
    }
    const message = await village.messages.fetch(game.config.messageId);
    const CupidEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Le Cupidon est arrivé !\n\n> Il a 60 secondes pour désigner deux joueurs qui s'aimeront pour la vie !`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    if (!message) {
        message = await village.send({ embeds: [CupidEmbed], components: [] })
        game.config.messageId = message.id;
    } else {
        message.edit({ embeds: [CupidEmbed], components: [] })
    }
    // creation salon cupidon
    let cupidChannel = await interaction.guild.channels.create("cupidon", {
        type: "GUILD_TEXT",
        parent: game.config.categoryId,
        permissionOverwrites: [{
            id: game.allPlayersRoles.find(x => x.name === "Cupidon").idPlayer,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS"],
        }, {
            id: game.config.roleId,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS"],
        }, {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS"],
        }]
    })
    game.config.cupidonChannelId = cupidChannel.id;
    // envoi message cupidon
    const row1 = new MessageActionRow()
    const row2 = new MessageActionRow()
    const row3 = new MessageActionRow()
    const row4 = new MessageActionRow()
    const row5 = new MessageActionRow()
    let finalrow = []
    for (const [i,playerId] of game.allPlayersId.entries()) {
        const player = await interaction.guild.members.cache.get(playerId);
        if (!player) {
            continue
        }
        if (i < 5) {
            finalrow = [row1]
            row1.addComponents(
                new MessageButton()
                    .setCustomId(`cupidon-${playerId}`)
                    .setLabel(`${player.user.username}`)
                    .setStyle('PRIMARY')
            )
        } else if (i < 10) {
            finalrow = [row1, row2]
            row2.addComponents(
                new MessageButton()
                    .setCustomId(`cupidon-${playerId}`)
                    .setLabel(`${player.user.username}`)
                    .setStyle('PRIMARY')
            )
        } else if (i < 15) {
            finalrow = [row1, row2, row3]
            row3.addComponents(
                new MessageButton()
                    .setCustomId(`cupidon-${playerId}`)
                    .setLabel(`${player.user.username}`)
                    .setStyle('PRIMARY')
            )
        } else if (i < 20) {
            finalrow = [row1, row2, row3, row4]
            row4.addComponents(
                new MessageButton()
                    .setCustomId(`cupidon-${playerId}`)
                    .setLabel(`${player.user.username}`)
                    .setStyle('PRIMARY')
            )
        } else if (i < 25) {
            finalrow = [row1, row2, row3, row4, row5]
            row5.addComponents(
                new MessageButton()
                    .setCustomId(`cupidon-${playerId}`)
                    .setLabel(`${player.user.username}`)
                    .setStyle('PRIMARY')
            )
        }
    }
    const embedCupid = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Choisis deux personnes qui s'aimeront pour la vie !\n\n> Tu as 60 secondes !`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    await cupidChannel.send({content:`<@${game.allPlayersRoles.find(x => x.name === "Cupidon").idPlayer}>`}).then(msg => msg.delete());
    await cupidChannel.send({ embeds: [embedCupid], components: finalrow }).then(msg => {
        const filter = interraction => interraction.message.id == msg.id;
        const collector = cupidChannel.createMessageComponentCollector({ filter, time: 3000 }); //! CHANGER LE TIME
        collector.on('collect', async collected => {
            if (collected.customId.startsWith("cupidon-") && game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).name === "Cupidon") {
                //? si lover1 n'est pas défini -> lover1 = joueur
                if (!game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).lover1) {
                    game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).lover1 = collected.customId.slice(8);
                    let selected = interaction.guild.members.cache.find(x => x.id === collected.customId.slice(8));
                    collected.reply({ content: `Tu as choisi ${selected.user.username}, qui d'autre ?`, ephemeral: true });
                } else if (!game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).lover2) {
                    if (!game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).lover1 === collected.customId.slice(8)) {
                        collected.reply({ content: "Vous ne pouvez pas choisir la même personne !", ephemeral: true });
                    } else {
                        game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).lover2 = collected.customId.slice(8);
                        collector.stop();
                    }
                }
            } else {
                collected.reply({ content: "Tu n'es pas le cupidon !", ephemeral: true });
            }
        });
        collector.on('end', async collected => {
            const message = await village.messages.fetch(game.config.messageId);
            const SucceedCupid = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`Le Cupidon a fait son choix !`)
                .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await message.edit({ embeds: [SucceedCupid], components: [] });
            if (game.allPlayersRoles.find(x => x.name === "Cupidon").lover1 && game.allPlayersRoles.find(x => x.name === "Cupidon").lover2) {
                // creation salon amoureux
                let lovedChannel = await interaction.guild.channels.create("amoureux", {
                    type: "GUILD_TEXT",
                    parent: game.config.categoryId,
                    permissionOverwrites: [
                        {
                            id: game.config.roleId,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: game.allPlayersRoles.find(x => x.name === "Cupidon").lover1,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        },
                        {
                            id: game.allPlayersRoles.find(x => x.name === "Cupidon").lover2,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        }
                    ],
                })
                game.config.lovedChannelId = lovedChannel.id;
                // envoi message amoureux
                let lover1 = await interaction.guild.members.cache.get(game.allPlayersRoles.find(x => x.name === "Cupidon").lover1);
                let lover2 = await interaction.guild.members.cache.get(game.allPlayersRoles.find(x => x.name === "Cupidon").lover2);
                const embedLoved = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${lover1} et ${lover2}, le Cupidon vous as liés pour la vie !\n\n> Vous pouvez parler entre vous dans ce salon !`)
                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await lovedChannel.send({ content: `<@${lover1}> et <@${lover2}>` }).then(msg => msg.delete());
                await lovedChannel.send({ embeds: [embedLoved], components: [] });
            }
            lock(cupidChannel, game);
            resolve();
        });
    });
}
module.exports = askCupidon;