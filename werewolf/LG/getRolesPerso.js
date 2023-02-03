const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const Villager = require("../roles/Villager.js");
const Seer = require("../roles/Seer.js");
const Witch = require("../roles/Witch.js");
const Werewolf = require("../roles/Werewolf.js");
const Hunter = require("../roles/Hunter.js");


async function getRolesPerso(interaction, date, game, resolve) {
    const getRoleEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`Il est maintenant temps de choisir les différents rôles du village !\n\n**Rôles** : \`${game.allPlayersId.length} à choisir\`\n\n> *Aucun rôle n'a encore été choisi*`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('villageois')
                .setLabel('Villageois')
                .setStyle("PRIMARY"),
            new ButtonBuilder()
                .setCustomId('voyante')
                .setLabel('Voyante')
                .setStyle("PRIMARY"),
            new ButtonBuilder()
                .setCustomId('sorciere')
                .setLabel('Sorcière')
                .setStyle("PRIMARY"),
            new ButtonBuilder()
                .setCustomId('chasseur')
                .setLabel('Chasseur')
                .setStyle("PRIMARY"),
            new ButtonBuilder()
                .setCustomId('loup')
                .setLabel('Loup-Garou')
                .setStyle("PRIMARY")
        )
    // const row2 = new ActionRowBuilder()    
    //     .addComponents(
    //         new ButtonBuilder()
    // 			.setCustomId('6')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('7')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('8')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('9')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('10')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY")
    //     )
    // const row3 = new ActionRowBuilder()
    //     .addComponents(
    //         new ButtonBuilder()
    // 			.setCustomId('11')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('12')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('13')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('14')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('15')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY")
    //     )
    // const row4 = new ActionRowBuilder()
    //     .addComponents(
    //         new ButtonBuilder()
    // 			.setCustomId('16')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('17')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('18')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('19')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY"),
    //         new ButtonBuilder()
    // 			.setCustomId('20')
    // 			.setLabel('Click me!')
    // 			.setStyle("PRIMARY")
    //     )
    const config = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('clear')
                .setLabel('Reinitialiser')
                .setStyle("DANGER"),
            new ButtonBuilder()
                .setLabel('Informations Rôles')
                .setURL("https://www.notion.so/Informations-R-les-Loup-Garou-d05aac21c86d4127a4f46ab0bcd435f5")
                .setStyle(ButtonStyle.Link),
        )
    await interaction.editReply({ embeds: [getRoleEmbed], components: [row,config] }).then(msg => {
        allRoles = [];
        const filter = interraction => interraction.message.id == msg.id;
        const collector = msg.channel.createMessageComponentCollector({
            filter,
            time: 60000
        })
        collector.on("collect", async collected => {
            switch(collected.customId) {
                case "clear":
                    allRoles = [];
                    break
                case 'villageois':
                    allRoles.push(new Villager());
                    break
                case 'voyante':
                    allRoles.push(new Seer());
                    break
                case 'sorciere':
                    allRoles.push(new Witch());
                    break
                case 'chasseur':
                    allRoles.push(new Hunter());
                    break
                case 'loup':
                    allRoles.push(new Werewolf());
                    break
                }
            if (collected.customId !== "clear") {
                getRoleEmbed.setDescription(`Il est maintenant temps de choisir les différents rôles du village !\n\n**Rôles** : \`${game.allPlayersId.length - allRoles.length} à choisir\`\n\n> ${allRoles.map(role => role.name).join('\n> ')}`)
                await msg.edit({ embeds: [getRoleEmbed], components: [row,config] });
            } else {
                getRoleEmbed.setDescription(`Il est maintenant temps de choisir les différents rôles du village !\n\n**Rôles** : \`${game.allPlayersId.length} à choisir\`\n\n> *Aucun rôle n'a encore été choisi*`)
                await msg.edit({ embeds: [getRoleEmbed], components: [row,config] });
            }
            await collected.deferUpdate();
            collector.resetTimer();
            if (allRoles.length == game.allPlayersId.length) {
                await (new Promise(async (resolve, reject) => {
                    await confirmChoice(game, date, msg, allRoles, resolve); // Choix des rôles perso
                }));
                if (game.config.choiceRoles && game.config.choiceRoles == true) {
                    collector.stop();
                } else {
                    allRoles = [];
                    getRoleEmbed.setDescription(`Il est maintenant temps de choisir les différents rôles du village !\n\n**Rôles** : \`${game.allPlayersId.length} à choisir\`\n\n> *Aucun rôle n'a encore été choisi*`)
                    await msg.edit({ embeds: [getRoleEmbed], components: [row,config] });
                }
            }
        })
        collector.on('end', async collected => {
            if (allRoles.length !== game.allPlayersId.length) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`Vous avez mis trop de temps à choisir les rôles du village !\n\n> *Vous pouvez relancer une partie pour recommencer*`)
                    .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({ embeds: [errorEmbed], components: [] });
                game.end = true;
                resolve();
            }
            const continueEmbed = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`Vous avez bien choisi les rôles du village !\n\n> *Je m'occupe de preparer la partie !*`)
                .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await msg.edit({ embeds: [continueEmbed], components: [] });
            game.allPlayersRoles = allRoles;
            game.allPlayersAlive = game.allPlayersRoles;
            resolve();
        })
    })
}

async function confirmChoice(game, date, msg, allRoles, resolve) {
    const filter = interraction => interraction.message.id == msg.id;
    const collector = msg.channel.createMessageComponentCollector({
        filter,
        time: 30000
    });
    const confirmEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`Êtes-vous d'utiliser ces rôles pour cette partie ?\n\n**Rôles** :\n\n> ${allRoles.map(role => role.name).join('\n> ')}`)
        .setThumbnail("https://media.discordapp.net/attachments/905980338017284197/1027940276775419955/lmt-logo-white.png?width=661&height=671")
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    const confirmRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('yes')
                .setLabel('Oui, c\'est parti !')
                .setStyle("SUCCESS"),
            new ButtonBuilder()
                .setCustomId('no')
                .setLabel('Non, on recommence')
                .setStyle("DANGER")
        )
    await msg.edit({ embeds: [confirmEmbed], components: [confirmRow] });
    collector.on("collect", async collected => {
        if (collected.customId === "yes") {
            game.config.choiceRoles = true;
            resolve();
        } else {
            game.config.choiceRoles = false;
            resolve();
        }
    })
    collector.on('end', async collected => {
        game.config.choiceRoles = false;
        resolve();
    })
}
module.exports = getRolesPerso;