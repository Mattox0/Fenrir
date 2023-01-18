const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duel')
        .setDescription('Entame un duel avec un adversaire')
        .addUserOption(option => option.setName('utilisateur').setDescription('Votre adversaire').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let player1 = interaction.member;
        let player2 = interaction.options.getUser('utilisateur');
        player2 = await interaction.member.guild.members.cache.find(x => x.id === player2.id);
        listediff = [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 30];
        hp1 = 100;
        hp2 = 100;
        const duel = new MessageEmbed()
            .setColor('#000000')
            .setTitle('⚔️ Duel ⚔️')
            .setDescription(`**${player2.user.username}**, Acceptes-tu ce duel de la part de **${player1.user.username}** ?`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Oui')
                    .setLabel('Let’s go')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('Non')
                    .setLabel('Fuite !')
                    .setStyle('DANGER'),
            )
        await interaction.deferReply();
        interaction.editReply({embeds: [duel], components: [row] }).then(msg => {
            const filter = interraction => interraction.user.id == player2.id && interraction.message.id == msg.id;
            const collector = msg.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 60000
            });
            collector.on('end', async collected => {
                if (!collected.first()) {
                    const delai = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **${player2} n'a pas répondu**`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({ embeds: [delai], components: [] });
                };
                collected.first().deferUpdate(); // évite le chargement infinie de l'intérraction
                switch (collected.first().customId) {
                    case 'Oui':
                        const debut = new MessageEmbed()
                            .setTitle(`${player1.user.username} ⚔️ ${player2.user.username}`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            .addFields(
                                { name: `**${player1.user.username}**`, value: `**${hp1}** HP`, inline: true },
                                { name: '|  ⁣    ⁣ VS    ⁣   |', value: '**|**  ⁣    ⁣ ⚡    ⁣   **|**', inline: true },
                                { name: `**${player2.user.username}**`, value: `**${hp2}** HP`, inline: true },
                            )
                        await msg.edit({ embeds: [debut], components: [] });
                        let i = Math.floor(Math.random() * 2);
                        let poped = false;
                        while (poped == false) {
                            i = i + 1;
                            await wait(1000);
                            diff = Math.floor(Math.random() * listediff.length);
                            if (i % 2 === 0) {
                                hp2 = hp2 - diff;
                                const attack1 = new MessageEmbed()
                                    .setTitle(`${player1.user.username} ⚔️ ${player2.user.username}`)
                                    .setColor('#2C75FF')
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                if (diff === 30) {
                                    attack1.addFields(
                                        { name: `**${player1.user.username}**`, value: `**${hp1}** HP`, inline: true },
                                        { name: '|    ⁣     ⁣     VS ⁣     ⁣     ⁣   |', value: `  ⁣   💥  DMG CRITIQUES -**${diff}** HP 💥 !`, inline: true },
                                        { name: `**${player2.user.username}**`, value: `**${hp2}** HP`, inline: true },
                                    );
                                } else if (diff === 0) {
                                    hp2 = hp2 + 5;
                                    attack1.addFields(
                                        { name: `**${player1.user.username}**`, value: `**${hp1}** HP`, inline: true },
                                        { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: `      🛡️ PARER 🛡️ +5 HP !`, inline: true },
                                        { name: `**${player2.user.username}**`, value: `**${hp2}** HP`, inline: true },
                                    );
                                } else {
                                    attack1.addFields(
                                        { name: `**${player1.user.username}**`, value: `**${hp1}** HP`, inline: true },
                                        { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: `    ⁣      ⁣  🤜 -${diff} HP 💥`, inline: true },
                                        { name: `**${player2.user.username}**`, value: `**${hp2}** HP`, inline: true },
                                    );
                                };
                                await msg.edit({ embeds: [attack1] })
                                if (hp2 <= 0) {
                                    poped = true;
                                };
                            } else {
                                hp1 = hp1 - diff;
                                const attack2 = new MessageEmbed()
                                    .setTitle(`${player1.user.username} ⚔️ ${player2.user.username}`)
                                    .setColor('#FF0000')
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                if (diff === 30) {
                                    attack2.addFields(
                                        { name: `**${player1.user.username}**`, value: `**${hp1}** HP`, inline: true },
                                        { name: '|    ⁣     ⁣   VS ⁣        ⁣   |', value: ` 💥 -${diff}HP DMG CRITIQUES  💥 !`, inline: true },
                                        { name: `**${player2.user.username}**`, value: `**${hp2}** HP`, inline: true },
                                    );
                                } else if (diff === 0) {
                                    hp1 = hp1 + 5;
                                    attack2.addFields(
                                        { name: `**${player1.user.username}**`, value: `**${hp1}** HP`, inline: true },
                                        { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: ` +5 HP 🛡️ PARER 🛡️  !`, inline: true },
                                        { name: `**${player2.user.username}**`, value: `**${hp2}** HP`, inline: true },
                                    );
                                } else {
                                    attack2.addFields(
                                        { name: `**${player1.user.username}**`, value: `**${hp1}** HP`, inline: true },
                                        { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: ` 💥 -${diff} HP 🤛`, inline: true },
                                        { name: `**${player2.user.username}**`, value: `**${hp2}** HP`, inline: true },
                                    );
                                };
                                await msg.edit({ embeds: [attack2] });
                                if (hp1 <= 0) {
                                    poped = true;
                                };
                            };
                        }
                        if (hp2 <= 0) {
                            const final = new MessageEmbed()
                                .setColor('#2f3136')
                                .setImage('https://media.giphy.com/media/DffShiJ47fPqM/giphy.gif')
                                .setDescription(`${player1} **est le grand vaincqueur !**\n\nAvec **${hp1}** HP restants`)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            await interaction.followUp({ embeds: [final] });
                        } else {
                            const final = new MessageEmbed()
                                .setColor('#2f3136')
                                .setImage('https://media.giphy.com/media/DffShiJ47fPqM/giphy.gif')
                                .setDescription(`${player2} **est le grand vaincqueur !**\n\nAvec **${hp2}** HP restants`)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            await interaction.followUp({ embeds: [final] });
                        }
                        return
                    case 'Non':
                        const fuite = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT__arrow:831817537388937277> ${player2} **a décliné ton offre**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({ embeds: [fuite], components: [] });
                };
            })
        })
    }
}