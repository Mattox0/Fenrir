const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

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
    let category = await interaction.guild.channels.create("Loup garou", { 
        type: "GUILD_CATEGORY",
        permissionOverwrites: [{
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS"],
        },{
            id: game.config.roleId,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS"],
        }]
    }).catch(console.error);
    game.config.categoryId = category.id;
    // creer un salon village dans la catégorie
    let village = await interaction.guild.channels.create("village", {
        type: "GUILD_TEXT",
    }).then(channel=> channel.setParent(category)).catch(console.error);
    game.config.villageId = village.id;
    resolve();
}
module.exports = setDiscordRoles;