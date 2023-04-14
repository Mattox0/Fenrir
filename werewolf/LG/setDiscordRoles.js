const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType} = require("discord.js");

async function setDiscordRoles(interaction, date, game, resolve) {
    // creer un role LG + l'assigner à tous les joueurs
    let role = await interaction.guild.roles.create({
        name:"LG",
        color:"GREY",
        reason:"Un role pour les joueurs de loup-garous."
    }).catch(console.error);
    game.config.roleId = role.id;
    game.allPlayersId.forEach(async id => {
        user = await interaction.guild.members.cache.find(x => x.id === id);
        user?.roles.add(role).catch(console.error);
    })
    // creer une catégorie LG + mettre les permissions de roles LG
    let category = await interaction.guild.channels.create({
        name: "Loup garou", 
        type: ChannelType.GuildCategory,
        permissionOverwrites: [{
            id: interaction.guild.roles.everyone,
            deny: [ViewChannel, SendMessages, ReadMessageHistory, AddReactions],
        },{
            id: game.config.roleId,
            allow: [ViewChannel, SendMessages, ReadMessageHistory, AddReactions],
        }]
    }).catch(console.error);
    game.config.categoryId = category.id;
    // creer un salon village dans la catégorie
    let village = await interaction.guild.channels.create({
        name: "village",
        type: ChannelType.GuildText,
    }).then(channel=> channel.setParent(category)).catch(console.error);
    game.config.villageId = village.id;
    resolve();
}
module.exports = setDiscordRoles;