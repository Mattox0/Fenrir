const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, db, date, client) {
        db.all('SELECT * FROM giveaways WHERE guild_id = ? AND past = ?',interaction.member.guild.id,false, async (err, res) => {
            if (err) return console.log(err);
            if (!res) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Il n\'y a aucun giveaway actif dans votre serveur**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]})
            }
            let description = []
            let countDesc = 0;
            let countPage = 1;
            let pages = [];
            await res.forEach(async (elem) => {
                let channel = await interaction.member.guild.channels.cache.find(x => x.id === elem.channel_id);
                description.push(`**Message :** [Message](https://discord.com/channels/${interaction.member.guild.id}/${elem.channel_id}/${elem.message_id})\n**Salon :** ${channel}\n**Gagnant(s) :** ${elem.winners}\n**Récompense :** ${elem.prize}`)
                countDesc++
                if (countDesc === 4) {
                    const page = new MessageEmbed()
                        .setColor('#2f3136')
                        .setTitle('Liste des giveaways actif')
                        .setDescription(description.join('\n\n'))
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${countPage} / ${Math.ceil(res.length / 4)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    pages.push(page);
                    countDesc = 0;
                    countPage++;
                    description = [];
                }
            })
            if (description.length !== 0) {
                const page = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Liste des giveaways actif')
                    .setDescription(description.join('\n\n'))
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${countPage} / ${Math.ceil(res.length / 4)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                pages.push(page)
            }
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('1')
                        .setEmoji('⏮️')
                        .setStyle('PRIMARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('-1')
                        .setEmoji('◀️')
                        .setStyle('PRIMARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('0')
                        .setEmoji('🔢')
                        .setStyle('PRIMARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('+1')
                        .setEmoji('▶️')
                        .setStyle('PRIMARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('2')
                        .setEmoji('⏭️')
                        .setStyle('PRIMARY')
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
                            const ask = new MessageEmbed()
                                .setColor('#2f3136')
                                .setDescription(`<a:LMT__arrow:831817537388937277> **Quel page tu veux voir ?** \`[1 - ${Math.ceil(allBans.size / 4)}]\``)
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
        })
    }
}