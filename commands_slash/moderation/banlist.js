const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const schedule = require('node-schedule')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Affiche la liste des bannis de votre serveur'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Tu ne peux pas faire justice toi-même !** \n**Appelle une personne plus qualifiée qui pourra t\'**\n**aider dans la démarche du bannissement**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        let allBans = await interaction.member.guild.bans.fetch();
        let description = ``;
        let countDesc = 0;
        let countPage = 1;
        let pages = [];
        allBans.forEach((elem) => {
            description += `**Fautif** : ${elem.user.username}#${elem.user.discriminator} (\`${elem.user.id}\`)\n`;
            if (elem.reason) {
                description += `**Raison** : ${elem.reason}\n\n`;
            } else {
                description += `**Raison** : Aucune\n\n`;
            }
            countDesc++
            if (countDesc === 4) {
                const page = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle('Liste des bannis')
                    .setDescription(description)
                    .setFooter({text :`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${countPage} / ${Math.ceil(allBans.size / 4)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                pages.push(page);
                countDesc = 0;
                countPage++;
                description = ``;
            }
        })
        if (description !== ``) {
            const page = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Liste des bannis')
                .setDescription(description)
                .setFooter({text :`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${countPage} / ${Math.ceil(allBans.size / 4)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            pages.push(page);
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('1')
                    .setEmoji('⏮️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('-1')
                    .setEmoji('◀️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('0')
                    .setEmoji('🔢')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('+1')
                    .setEmoji('▶️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('2')
                    .setEmoji('⏭️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
        )
        let isComponent = false;
        await interaction.deferReply();
        interaction.editReply({embeds : [pages[0]],components:[row]}).then(msg => {
            count = 0
            if (pages.length > 1) {
                isComponent = true
                row.components[4].setDisabled(false)
                row.components[3].setDisabled(false)
                row.components[2].setDisabled(false)
                msg.edit({embeds:[pages[count]],components:[row]})
            }
            const filter = interaction => interaction.message.id === msg.id
            const collector = msg.channel.createMessageComponentCollector({ filter, time:60000})
            collector.on('collect', collected => {
                collector.resetTimer();
                collected.deferUpdate();
                switch (collected.customId) {
                    case '1':
                        count = 0
                        if (isComponent) {
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(true)
                            row.components[4].setDisabled(false)
                            row.components[3].setDisabled(false)
                        }
                        msg.edit({embeds:[pages[count]],components:[row]})
                        break
                    case '-1':
                        count = count - 1
                        if (isComponent) {
                            if (count === 0) {
                                row.components[0].setDisabled(true)
                                row.components[1].setDisabled(true)
                                row.components[4].setDisabled(false)
                                row.components[3].setDisabled(false)
                            } else {
                                row.components[0].setDisabled(false)
                                row.components[1].setDisabled(false)
                                row.components[4].setDisabled(false)
                                row.components[3].setDisabled(false)
                            }
                        }
                        msg.edit({embeds:[pages[count]],components:[row]})
                        break
                    case '+1':
                        count = count + 1
                        if (isComponent) {
                            if (count === pages.length - 1) {
                                row.components[4].setDisabled(true)
                                row.components[3].setDisabled(true)
                                row.components[1].setDisabled(false)
                                row.components[0].setDisabled(false)
                            } else {
                                row.components[4].setDisabled(false)
                                row.components[3].setDisabled(false)
                                row.components[1].setDisabled(false)
                                row.components[0].setDisabled(false)
                            }
                        }
                        msg.edit({embeds:[pages[count]],components:[row]})
                        break
                    case '2':
                        count = pages.length - 1
                        if (isComponent) {
                            row.components[4].setDisabled(true)
                            row.components[3].setDisabled(true)
                            row.components[0].setDisabled(false)
                            row.components[1].setDisabled(false)
                        }
                        msg.edit({embeds:[pages[count]],components:[row]})
                        break
                    case '0':
                        const ask = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT_arrow:1065548690862899240> **Quel page tu veux voir ?** \`[1 - ${Math.ceil(allBans.size / 4)}]\``)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({embeds:[pages[count],ask]}).then(messg => {
                            let page = count;
                            const filter = m => m.channelId === collected.channel.id && collected.member.id === m.author.id
                            const collector2 = msg.channel.createMessageCollector({ filter, time:20000})
                            collector2.on('collect',collect => {
                                collect.delete()
                                page = collect.content.replace(/[^0-9]/g, '')
                                if (page >= 1 && page <= Math.ceil(allBans.size / 4)) {
                                    collector2.stop()
                                } else {
                                    messg.channel.send('Nombre incorrect !').then(async msg => {
                                        await wait(1000);
                                        msg.delete();
                                    })
                                }
                            })
                            collector2.on('end', collect => {
                                if (!collect) {
                                    msg.edit({embeds:[pages[count]],components:[row]})
                                } else {
                                count2 = page - 1
                                    if (count2 === pages.length - 1) {
                                        row.components[4].setDisabled(true)
                                        row.components[3].setDisabled(true)
                                        row.components[1].setDisabled(false)
                                        row.components[0].setDisabled(false)
                                    } else if (count === 0) {
                                        row.components[0].setDisabled(true)
                                        row.components[1].setDisabled(true)
                                        row.components[4].setDisabled(false)
                                        row.components[3].setDisabled(false)
                                    } else {
                                        row.components[4].setDisabled(false)
                                        row.components[3].setDisabled(false)
                                        row.components[1].setDisabled(false)
                                        row.components[0].setDisabled(false)
                                    }
                                    msg.edit({embeds:[pages[count2]],components:[row]})  
                                }
                            })
                        })

                }
            })
            collector.on('end', () => {
                msg.edit({embeds:[pages[count]],components:[]})
            })
        })
    }
}