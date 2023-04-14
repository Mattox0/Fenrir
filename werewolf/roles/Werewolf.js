const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType} = require("discord.js");
const lock = require("./../LG/lock.js");
const unlock = require("./../LG/lock.js");
const Player = require("./Player.js");

class Werewolf extends Player {
    constructor() {
        super("Loup Garou", 2)
    }
    
    async vote(interaction, date, game, resolve) {
        const village = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
        const category = await interaction.guild.channels.cache.find(channel => channel.id === game.config.categoryId);
        if (!village || !category) {
            game.end = true;
            return resolve();
        }
        const message = await village.messages.fetch(game.config.messageId);
        const WerewolfEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`Les Loup Garou font leurs choix !\n\n> Il ont 60 secondes pour se décider !`)
            .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (!message) {
            message = await village.send({ embeds: [WerewolfEmbed], components: [] })
            game.config.messageId = message.id;
        } else {
            message.edit({ embeds: [WerewolfEmbed], components: [] })
        }
        let werewolfChannel = interaction.guild.channels.cache.find(channel => channel.id === game.config.werewolfChannelId);
        if (!werewolfChannel) {
            werewolfChannel = await interaction.guild.channels.create({
                name: "loups-garou",
                type: ChannelType.GuildText,
                parent: game.config.categoryId,
                permissionOverwrites: [
                    {
                        id: game.config.roleId,
                        deny: [ViewChannel],
                    },
                    {
                        id: game.allPlayersRoles.find(role => role.name === "Loup Garou").idPlayer,
                        allow: [ViewChannel],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [ViewChannel],
                    }
                ]
            })
            game.config.werewolfChannelId = werewolfChannel.id;
        }
        unlock(werewolfChannel, game);
    }
}
module.exports = Werewolf;