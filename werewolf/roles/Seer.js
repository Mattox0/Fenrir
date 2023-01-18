const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { lock, unlock } = require("../LG/lock.js");
const Player = require("./Player.js");

class Seer extends Player {
    constructor() {
        super("Voyante", 1)
    }

    async seeRolePlayer(interaction, date, game, resolve) {
        const village = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
        const category = await interaction.guild.channels.cache.find(channel => channel.id === game.config.categoryId);
        if (!village || !category) {
            game.end = true;
            return resolve();
        }
        const message = await village.messages.fetch(game.config.messageId);
        const SeerEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`La Voyante fait son choix !\n\n> Elle a 60 secondes pour se décider !`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (!message) {
            message = await village.send({ embeds: [SeerEmbed], components: [] })
            game.config.messageId = message.id;
        } else {
            message.edit({ embeds: [SeerEmbed], components: [] })
        }
        let seerChannel = interaction.guild.channels.cache.find(channel => channel.id === game.config.seerChannelId);
        if (!seerChannel) {
            seerChannel = await interaction.guild.channels.create("voyante", {
                type: "GUILD_TEXT",
                parent: game.config.categoryId,
                permissionOverwrites: [
                    {
                        id: game.config.roleId,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: game.allPlayersRoles.find(role => role.name === "Voyante").idPlayer,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    }
                ]
            })
            game.config.seerChannelId = seerChannel.id;
        }
        unlock(seerChannel, game);
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
                        .setCustomId(`seer-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 10) {
                finalrow = [row1, row2]
                row2.addComponents(
                    new MessageButton()
                        .setCustomId(`seer-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 15) {
                finalrow = [row1, row2, row3]
                row3.addComponents(
                    new MessageButton()
                        .setCustomId(`seer-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 20) {
                finalrow = [row1, row2, row3, row4]
                row4.addComponents(
                    new MessageButton()
                        .setCustomId(`seer-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 25) {
                finalrow = [row1, row2, row3, row4, row5]
                row5.addComponents(
                    new MessageButton()
                        .setCustomId(`seer-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            }
        }
        const seerChoiceEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`Tu es la Voyante !\n\n> Tu as 60 secondes pour révéler le rôle d'un utilisateur !`)
            .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await seerChannel.send({content:`<@${game.allPlayersRoles.find(x => x.name === "Voyante").idPlayer}>`}).then(msg => msg.delete());
        await seerChannel.send({ embeds: [seerChoiceEmbed], components: finalrow }).then(msg => {
            const filter = interraction => interraction.message.id == msg.id;
            const collector = seerChannel.createMessageComponentCollector({ filter, time: 60000 });
            collector.on('collect', async collected => {
                if (collected.customId.startsWith("seer-") && game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).name === "Voyante") {
                    let selected = await interaction.guild.members.cache.find(x => x.id === collected.customId.slice(5));
                    await collected.reply({content: `Le rôle de ${selected.user.username} est **${game.allPlayersRoles.find(x => x.idPlayer === collected.customId.slice(5)).name}**`, ephemeral: true});
                    collector.stop();
                } else {
                    await collected.reply({content: `Tu n'es pas la Voyante !`, ephemeral: true});
                }
            });
            collector.on('end', collected => {
                lock(seerChannel, game);
                resolve();
            });
        });
    }
}
module.exports = Seer;