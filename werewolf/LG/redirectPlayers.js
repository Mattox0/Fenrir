const { MessageEmbed } = require("discord.js");


async function redirectPlayers(interaction, date, game, resolve) {
    const channel = await interaction.guild.channels.cache.find(channel => channel.id === game.config.villageId);
    const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Tout est prêt pour la partie !\n\n> Direction le village : ${channel}`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    await interaction.editReply({ embeds: [embed], components: [] }).then(msg => {
        game.config.messageId = msg.id;
    });
    resolve();
}
module.exports = redirectPlayers;
