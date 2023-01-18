const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

async function getPersoOrAuto(interaction, date, game, resolve) {
    const choice = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Voulez vous choisir vos rôles manuellement ou me laisser choisir pour vous ?`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('perso')
                .setLabel('Choisir mes rôles')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('auto')
                .setLabel('Me laisser choisir')
                .setStyle('PRIMARY')
        );
    await interaction.editReply({ embeds: [choice], components: [row] }).then(msg => {
        const filter = interraction => interraction.message.id == msg.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
        collector.on("collect", async collected => {
            if (collected.customId == "perso") {
                await collected.deferUpdate();
                game.config.roleChoice = "perso";
                resolve("perso");
            } else if (collected.customId == "auto") {
                await collected.deferUpdate();
                game.config.roleChoice = "auto";
                resolve("auto");
            }
        });
        collector.on("end", async collected => {
            const errorEmbed = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`Vous avez mis trop de temps à vous décider !\n\n> *Vous pouvez relancer une partie pour recommencer*`)
                .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await msg.edit({ embeds: [errorEmbed], components: [] });
            game.end = true;
            resolve();
        });

    });
}
module.exports = getPersoOrAuto;