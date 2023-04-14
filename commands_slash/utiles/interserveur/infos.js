const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, db, date, client) {
        db.query("SELECT * FROM interserveur WHERE guild_id_1 = ? OR guild_id_2 = ?", [interaction.member.guild.id,interaction.member.guild.id], async (err, res) => {
            let description = `<a:LMT_arrow:1065548690862899240> **Le système d'interserveur sert à connecter deux salons de deux serveur différents.**\n\n> \`/interserveur open\` pour ouvrir une connexion\n> \`/interserveur join <code>\` dans un autre salon pour rejoindre une connexion.\n\n**Vos interserveurs :**`;
            if (err) return console.log(err);
            if (res.length === 0) {
                description += "Ce serveur n'a aucun interserveur avec un autre.";
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(description)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]})
            } else {
                let pages = [];
                let nbPage = 1;
                tabDescription = [];
                for (let element of res) {
                    if (element.code !== null) continue;
                    let guild1 = await client.guilds.cache.get(element.guild_id_1);
                    let guild2 = await client.guilds.cache.get(element.guild_id_2);
                    if (!guild1 || !guild2) continue;
                    let channel1 = await guild1.channels.cache.find(x => x.id === element.channel_id_1);
                    let channel2 = await guild2.channels.cache.find(x => x.id === element.channel_id_2);
                    if (!channel1 || !channel2) continue;
                    if (guild1.id === interaction.member.guild.id) {
                        tabDescription.push(`**Serveur :** ${guild2.name} (\`${guild2.id}\`)\n**Salon :** ${channel2}`)
                    } else {
                        tabDescription.push(`**Serveur :** ${guild1.name} (\`${guild1.id}\`)\n**Salon :** ${channel1}`)
                    }
                    if (tabDescription.length === 4) {
                        let page = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`${description}\n\n${tabDescription.join('\n\n')}`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbPage} / ${Math.ceil(res.length / 4)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        pages.push(page);
                        nbPage++;
                        tabDescription = [];
                    }
                };
                if (tabDescription.length !== 0) {
                    let page = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`${description}\n\n${tabDescription.join('\n\n')}`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbPage} / ${Math.ceil(res.length / 4)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    pages.push(page)
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
                                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Quel page tu veux voir ?** \`[1 - ${Math.ceil(res.length/3)}]\``)
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                msg.edit({embeds:[pages[count],ask]}).then(messg => {
                                    let page = count;
                                    const filter = m => m.channelId === collected.channel.id && collected.member.id === m.author.id
                                    const collector2 = msg.channel.createMessageCollector({ filter, time:20000})
                                    collector2.on('collect',collect => {
                                        collect.delete()
                                        page = collect.content.replace(/[^0-9]/g, '')
                                        if (page >= 1 && page <= Math.ceil(res.length/3)) {
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
        })
    }
}