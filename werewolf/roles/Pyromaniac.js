const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const lock = require("./../LG/lock.js");
const unlock = require("./../LG/lock.js");
const Player = require("./Player.js");

class Pyromaniac extends Player {
    allInflamed;
    wantToBurn;

    constructor() {
        super("Pyromane", 3)
        this.allInflamed = [];
        this.wantToBurn = false;
    }

    async chooseBurn(interaction, date, game, resolve) {
        const village = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
        const category = await interaction.guild.channels.cache.find(channel => channel.id === game.config.categoryId);
        if (!village || !category) {
            game.end = true;
            return resolve();
        }
        const message = await village.messages.fetch(game.config.messageId);
        const PyromaneEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Le Pyromane fait son choix !\n\n> Il a 60 secondes pour se décider !`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (!message) {
            message = await village.send({ embeds: [PyromaneEmbed], components: [] })
            game.config.messageId = message.id;
        } else {
            message.edit({ embeds: [PyromaneEmbed], components: [] })
        }
        let pyromaniacChannel = interaction.guild.channels.cache.find(channel => channel.id === game.config.pyromaniacChannelId);
        if (!pyromaniacChannel) {
            pyromaniacChannel = await interaction.guild.channels.create("pyromane", {
                type: "GUILD_TEXT",
                parent: game.config.categoryId,
                permissionOverwrites: [
                    {
                        id: game.config.roleId,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: game.allPlayersRoles.find(role => role.name === "Pyromane").idPlayer,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    }
                ]
            })
            game.config.pyromaniacChannelId = pyromaniacChannel.id;
        }
        unlock(pyromaniacChannel, game);
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('burn')
                    .setLabel('Faire bruler les personnes imbibées d\'essence')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('notburn')
                    .setLabel('Mettre de l\'essence sur deux personnes')
                    .setStyle('PRIMARY'),
            );
        const pyromaniacChoiceEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`Tu es le Pyromane !\n\n> Tu as 60 secondes pour faire ton choix entre :\n> - Mettre de l'essence sur deux personnes\n> - Faire bruler les personnes imbibées d'essence`)
            .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await pyromaniacChannel.send({ content: `<@${game.allPlayersRoles.find(role => role.name === "Pyromane").idPlayer}>` }).then(msg => msg.delete());
        await pyromaniacChannel.send({ embeds: [pyromaniacChoiceEmbed], components: [row] }).then(msg => {
            let choice = null
            const filter = interaction => interaction.message.id == msg.id;
            const collector = pyromaniacChannel.createMessageComponentCollector({ filter, time: 60000 });
            collector.on('collect', async collected => {
                if (game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).name === "Pyromane") {
                    if (collected.customId === 'burn') {
                        // bruler les personnes imbibées d'essence
                        choice = "burn"
                    } else if (collected.customId === 'notburn') {
                        // choisir 2 personnes
                        choice = "notburn"
                    }
                    collector.stop();
                } else {
                    collected.reply({ content: "Tu n'es pas le Pyromane !", ephemeral: true });
                }
            })
            collector.on('end', async collected => {
                if (choice === "burn") {
                    this.wantToBurn = true;
                    const BurnEmbed = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`Tu as choisis de faire bruler les personnes imbibées d'essence`)
                        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    await msg.edit({ embeds: [BurnEmbed], components: [] });
                } else if (choice === "notburn") {
                    const row1 = new MessageActionRow()
                    const row2 = new MessageActionRow()
                    const row3 = new MessageActionRow()
                    const row4 = new MessageActionRow()
                    const row5 = new MessageActionRow()
                    let finalrow = [];
                    for (let [i,playerId] of game.allPlayersAlive.entries()) {
                        playerId = playerId.idPlayer;
                        const player = await interaction.guild.members.cache.find(x => x.id === playerId);
                        if (!player) {
                            continue;
                        }
                        if (i < 5) {
                            finalrow = [row1]
                            row1.addComponents(
                                new MessageButton()
                                    .setCustomId(`pyromaniac-${playerId}`)
                                    .setLabel(`${player.user.username}`)
                                    .setStyle('PRIMARY')
                            )
                        } else if (i < 10) {
                            finalrow = [row1, row2]
                            row2.addComponents(
                                new MessageButton()
                                    .setCustomId(`pyromaniac-${playerId}`)
                                    .setLabel(`${player.user.username}`)
                                    .setStyle('PRIMARY')
                            )
                        } else if (i < 15) {
                            finalrow = [row1, row2, row3]
                            row3.addComponents(
                                new MessageButton()
                                    .setCustomId(`pyromaniac-${playerId}`)
                                    .setLabel(`${player.user.username}`)
                                    .setStyle('PRIMARY')
                            )
                        } else if (i < 20) {
                            finalrow = [row1, row2, row3, row4]
                            row4.addComponents(
                                new MessageButton()
                                    .setCustomId(`pyromaniac-${playerId}`)
                                    .setLabel(`${player.user.username}`)
                                    .setStyle('PRIMARY')
                            )
                        } else if (i < 25) {
                            finalrow = [row1, row2, row3, row4, row5]
                            row5.addComponents(
                                new MessageButton()
                                    .setCustomId(`pyromaniac-${playerId}`)
                                    .setLabel(`${player.user.username}`)
                                    .setStyle('PRIMARY')
                            )
                        }
                    }
                    const NotBurnEmbed = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`Tu as choisis de mettre de l'essence sur deux personnes !\n\n> Sur qui veux-tu mettre de l'essence ?\n> Tu as 60 secondes pour choisir !`)
                        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    await msg.edit({ embeds: [NotBurnEmbed], components: [] }).then(msg => {
                        let count = 0;
                        const filter = interaction => interaction.message.id == msg.id;
                        const collector = pyromaniacChannel.createMessageComponentCollector({ filter, time: 60000 });
                        collector.on('collect', async collected => {
                            if (collected.customId.startsWith("pyromaniac-") && game.allPlayersRoles.find(x => x.idPlayer === collected.user.id).name === "Pyromane") {
                                let selected = await interaction.guild.members.cache.find(x => x.id === collected.customId.slice(11));
                                if (game.allPlayersRoles.find(x => x.name === "Pyromane").allInflamed.includes(selected.user.id)) {
                                    await collected.reply({ content: `**${selected.user.username}** est déjà imbibé d'essence !`, ephemeral: true });
                                } else if (count == 0) {
                                    await collected.reply({ content: `Tu as mis de l'essence sur **${selected.user.username}** ! Qui d'autre ?`, ephemeral: true });
                                    game.allPlayersRoles.find(x => x.name === "Pyromane").allInflamed.push(selected.user.id);
                                    count++;
                                } else if (count == 1) {
                                    await collected.reply({ content: `Tu as mis de l'essence sur **${selected.user.username}** !`, ephemeral: true });
                                    game.allPlayersRoles.find(x => x.name === "Pyromane").allInflamed.push(selected.user.id);
                                    count++;
                                }
                                if (count == 2) {
                                    collector.stop();
                                }
                            } else {
                                await collected.reply({content: `Tu n'es pas le Pyromane !`, ephemeral: true});
                            }
                        });
                        collector.on('end', async collected => {
                            if (count == 2) {
                                const SuccedEmbed = new MessageEmbed()
                                    .setColor('#2f3136')
                                    .setDescription(`Tes choix sont fait !`)
                                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                await msg.edit({ embeds: [SuccedEmbed], components: [] });
                            } else {
                                const TimeEmbed = new MessageEmbed()
                                    .setColor('#2f3136')
                                    .setDescription(`Tu as mis trop de temps à choisir !`)
                                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                await msg.edit({ embeds: [TimeEmbed], components: [] });
                            }
                        });
                    })
                } else {
                    const TimeEmbed = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`Tu as mis trop de temps à choisir !`)
                        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    await msg.edit({ embeds: [TimeEmbed], components: [] });
                }
                lock(pyromaniacChannel, game);
                resolve();
            });
        })
    }
}
module.exports = Pyromaniac;