const { EmbedBuilder } = require("discord.js");
const Seer = require("../roles/Seer");
const Villager = require("../roles/Villager");
const Werewolf = require("../roles/Werewolf");
const Witch = require("../roles/Witch");

async function getRolesAuto(interaction, date, game, resolve) {
    game.allPlayersRoles = [new Villager(), new Werewolf(), new Seer(), new Witch()];
    game.allPlayersAlive = game.allPlayersRoles;
    const infoEmbed = new EmbedBuilder()
        .setColor("2f3136")
        .setDescription(`Voici la liste des rôles de la partie :\n\n> ${game.allPlayersRoles.map(role => role.name).join('\n> ')}`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    await interaction.editReply({embeds: [infoEmbed], components: []});
}
module.exports = getRolesAuto;
