const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

async function setUserRoles(interaction, date, game, resolve) {
    allIds = game.allPlayersId;
    let allIdRandoms = allIds
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value) 
    await game.allPlayersRoles.forEach(player => {
        player.idPlayer = allIdRandoms[0];
        allIdRandoms.shift();
    });
    const setRolesEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Les rôles ont été distribués aux village !\n\n> *Encore un peu de patience*`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    await interaction.editReply({ embeds: [setRolesEmbed], components: [] });
    resolve();
}
module.exports = setUserRoles;