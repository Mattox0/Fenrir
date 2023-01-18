const Player = require("./Player.js");

class Bodyguard extends Player {
    protect;
    oldprotect;
    
    constructor() {
        super("Garde du corps", 1)
    }

    async protectPlayer(interaction, date, game, resolve) {
        const village = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
        const category = await interaction.guild.channels.cache.find(channel => channel.id === game.config.categoryId);
        if (!village || !category) {
            game.end = true;
            return resolve();
        }
        const message = await village.messages.fetch(game.config.messageId);
        const BodyGardEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Le Garde du Corps fait son choix !\n\n> Il a 60 secondes pour se décider !`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (!message) {
            message = await village.send({ embeds: [BodyGardEmbed], components: [] })
            game.config.messageId = message.id;
        } else {
            message.edit({ embeds: [BodyGardEmbed], components: [] })
        }
        let bodyguardChannel = interaction.guild.channels.cache.find(channel => channel.id === game.config.bodyguardChannelId);
        if (!bodyguardChannel) {
            bodyguardChannel = await interaction.guild.channels.create("garde-du-corps", {
                type: "GUILD_TEXT",
                parent: game.config.categoryId,
                permissionOverwrites: [
                    {
                        id: game.config.roleId,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: game.allPlayersRoles.find(role => role.name === "Garde du Corps").idPlayer,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    }
                ]
            })
            game.config.bodyguardChannelId = bodyguardChannel.id;
        }
        unlock(bodyguardChannel, game);
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
                        .setCustomId(`bodyguard-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 10) {
                finalrow = [row1, row2]
                row2.addComponents(
                    new MessageButton()
                        .setCustomId(`bodyguard-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 15) {
                finalrow = [row1, row2, row3]
                row3.addComponents(
                    new MessageButton()
                        .setCustomId(`bodyguard-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 20) {
                finalrow = [row1, row2, row3, row4]
                row4.addComponents(
                    new MessageButton()
                        .setCustomId(`bodyguard-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            } else if (i < 25) {
                finalrow = [row1, row2, row3, row4, row5]
                row5.addComponents(
                    new MessageButton()
                        .setCustomId(`bodyguard-${playerId}`)
                        .setLabel(`${player.user.username}`)
                        .setStyle('PRIMARY')
                )
            }
        }
        const bodyguardChoiceEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`Tu es le Garde du Corps !\n\n> Tu as 60 secondes pour défendre une personne !`)
            .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await bodyguardChannel.send({content:`<@${game.allPlayersRoles.find(x => x.name === "Garde du Corps").idPlayer}>`}).then(msg => msg.delete());
        await bodyguardChannel.send({ embeds: [bodyguardChoiceEmbed], components: finalrow }).then(msg => {
            game.allPlayersRoles.find(x => x.name === "Garde du Corps").oldprotect = game.allPlayersRoles.find(x => x.name === "Garde du Corps").protect;
            game.allPlayersRoles.find(x => x.name === "Garde du Corps").protect = null;
            const filter = interraction => interraction.message.id == msg.id;
            const collector = bodyguardChannel.createMessageComponentCollector({ filter, time: 60000 });
            collector.on('collect', async collected => {
                if (collected.customId.startsWith("bodyguard-") && game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).name === "Garde du Corps") {
                    let selected = await interaction.guild.members.cache.find(x => x.id === collected.customId.slice(10));
                    if (selected.user.id != game.allPlayersRoles.find(x => x.name === "Garde du Corps").oldprotect) {
                        game.allPlayersRoles.find(x => x.name === "Garde du Corps").protect = selected.user.id;
                        await collected.reply({content: `Tu défendra **${selected.user.username}** !`, ephemeral: true});
                        collector.stop();
                    } else {
                        await collected.reply({content: `Tu ne peux pas défendre la même personne deux fois de suite !`, ephemeral: true});
                    }
                } else {
                    await collected.reply({content: `Tu n'es pas le Garde du Corps !`, ephemeral: true});
                }
            });
            collector.on('end', collected => {
                lock(bodyguardChannel, game);
                resolve();
            });
        });
    };
}
module.exports = Bodyguard;