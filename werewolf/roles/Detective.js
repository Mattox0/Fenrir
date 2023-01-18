const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const lock = require("./../LG/lock.js");
const unlock = require("./../LG/lock.js");
const Player = require("./Player.js");

class Detective extends Player {
    constructor() {
        super("Detective", 1)
    }

    async seeCampsPlayer(interaction, date, game, resolve) {
        const village = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
        const category = await interaction.guild.channels.cache.find(channel => channel.id === game.config.categoryId);
        if (!village || !category) {
            game.end = true;
            return resolve();
        }
        const message = await village.messages.fetch(game.config.messageId);
        const DetectiveEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Le Detective fait son choix !\n\n> Il a 60 secondes pour se décider !`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (!message) {
            message = await village.send({ embeds: [DetectiveEmbed], components: [] })
            game.config.messageId = message.id;
        } else {
            message.edit({ embeds: [DetectiveEmbed], components: [] })
        }
        let detectiveChannel = interaction.guild.channels.cache.find(channel => channel.id === game.config.detectiveChannelId);
        if (!detectiveChannel) {
            detectiveChannel = await interaction.guild.channels.create("detective", {
                type: "GUILD_TEXT",
                parent: game.config.categoryId,
                permissionOverwrites: [
                    {
                        id: game.config.roleId,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: game.allPlayersRoles.find(role => role.name === "Detective").idPlayer,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    }
                ]
            })
            game.config.detectiveChannelId = detectiveChannel.id;
        }
        unlock(detectiveChannel, game);
        const row1 = new MessageActionRow()
        const row2 = new MessageActionRow()
        const row3 = new MessageActionRow()
        const row4 = new MessageActionRow()
        const row5 = new MessageActionRow()
        let finalrow = []
        for (let [i,playerId] of game.allPlayersAlive.entries()) {
            playerId = playerId.idPlayer;
            const player = await interaction.guild.members.cache.find(x => x.id === playerId);
            if (!player) {
                continue
            }
            if (i < 5) {
                finalrow = [row1]
                row1.addComponents(
                    new MessageButton()
                        .setCustomId(`detective-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 10) {
                finalrow = [row1, row2]
                row2.addComponents(
                    new MessageButton()
                        .setCustomId(`detective-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 15) {
                finalrow = [row1, row2, row3]
                row3.addComponents(
                    new MessageButton()
                        .setCustomId(`detective-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 20) {
                finalrow = [row1, row2, row3, row4]
                row4.addComponents(
                    new MessageButton()
                        .setCustomId(`detective-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 25) {
                finalrow = [row1, row2, row3, row4, row5]
                row5.addComponents(
                    new MessageButton()
                        .setCustomId(`detective-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            }
        }
        const detectiveChoiceEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`Tu es le Détective !\n\n> Tu as 60 secondes pour choisir deux personnes et révéler leurs camps !`)
            .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await detectiveChannel.send({ content: `<@${game.allPlayersRoles.find(role => role.name === "Detective").idPlayer}>` }).then(msg => msg.delete());
        await detectiveChannel.send({ embeds: [detectiveChoiceEmbed], components: finalrow }).then(msg => {
            let player = null;
            const filter = interaction => interaction.message.id == msg.id;
            const collector = detectiveChannel.createMessageComponentCollector({ filter, time: 60000 });
            collector.on('collect', async collected => {
                if (collected.customId.startsWith("detective-") && game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).name === "Detective") {
                    let selected = await interaction.guild.members.cache.find(x => x.id === collected.customId.slice(10));
                    if (!player) {
                        player = selected;
                        await collected.reply({content: `Tu as choisi ${selected.user.username} ! Qui d'autre ?`, ephemeral: true});
                    } else if (player.user.id === selected.user.id) {
                        await collected.reply({content: `Tu as déjà choisi cette personne !`, ephemeral: true});
                    } else {
                        if (game.allPlayersRoles.find(x => x.idPlayer === selected.user.id).camps === game.allPlayersRoles.find(x => x.idPlayer === player.user.id).camps) {
                            await collected.reply({content: `${player} et ${selected} sont du même camps !`, ephemeral: true});
                        } else {
                            await collected.reply({content: `${player} et ${selected} sont de camps différents !`, ephemeral: true});
                        }
                        collector.stop()
                    }
                } else {
                    await collected.reply({content: `Tu n'es pas le Détective !`, ephemeral: true});
                }
            });
            collector.on('end', async collected => {
                lock(detectiveChannel, game);
                resolve();
            });
        })
    }
}
module.exports = Detective;