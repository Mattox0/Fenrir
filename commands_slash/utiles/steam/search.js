const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    async execute(interaction, db, date) {
        await interaction.deferReply()
        const wait = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Chargement de votre requête**')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.editReply({embeds:[wait]})
        fetch('https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json')
        .then(response => response.json())
        .then(async (data) => {
            let tab = data.applist.apps.filter(x => x.name.includes(interaction.options.getString('recherche')))
            if (tab.length === 0) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **Désolé, votre recherche n\'a rien trouvé !**\n\n> \`${interaction.options.getString('recherche')}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.editReply({embeds:[fail], ephemeral:true})
            }
            let pages = [];
            let nbPage = 1;
            for (let x of tab.slice(0,50)) {
                await fetch(`https://store.steampowered.com/api/appdetails?appids=${x.appid}`)
                .then(response => response.json())
                .then(async (data) => {
                    let num = `${x.appid}`
                    let name = data[num].data.name.replaceAll(' ', '_');
                    let url = decodeURI(`https://store.steampowered.com/app/${num}/${name}/`)
                    url = encodeURI(url)
                    if (data[num].data.website) {
                        website = `\n🌐 : ${data[num].data.website}`
                    } else {
                        website = ''
                    }
                    let cool = await fetch(url);
                    if (cool.status === 200) {
                        link = `\n<:LMT_Steam:933284290618335275> : ${url}`;
                    } else {
                        link = '';
                    }
                    if (data[num].data.is_free) {
                        prix = "> \`Gratuit\` : Oui"
                    } else {
                        if (data[num].data.price_overview) {
                            if (data[num].data.price_overview.final_formatted) {
                                prix = `> \`Prix\` : ${data[num].data.price_overview.final_formatted}`
                            } else {
                                prix = "> \`Gratuit\` : Non"
                            }
                        } else {
                            prix = "> \`Gratuit\` : Non"
                        }
                    }
                    if (data[num].data.platforms) {
                        platforms = "\n> \`Plateformes\` : "
                        if (data[num].data.platforms.windows) {
                            platforms += "Windows "
                        }
                        if (data[num].data.platforms.linux) {
                            platforms += "Linux "
                        }
                        if (data[num].data.platforms.mac) {
                            platforms += "Mac "
                        }
                    } else {
                        platforms = ""
                    }
                    if (data[num].data.release_date) {
                        release = `\n> \`Date de sortie\` : ${data[num].data.release_date.date}`
                    }
                    const page = new MessageEmbed()
                        .setColor('#2f3136')
                        .setImage(data[num].data.header_image)
                        .setTitle(data[num].data.name)
                        .setDescription(`${data[num].data.short_description}\n\n${prix}${platforms}${release}\n\n${website}${link}`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbPage} / ${tab.slice(0,50).length}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    pages.push(page);
                    nbPage++;
                })
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
                const collector = msg.channel.createMessageComponentCollector({ filter, time:120000})
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
                                .setDescription(`<a:LMT__arrow:831817537388937277> **Quel page tu veux voir ?** \`[1 - ${tab.slice(0,50).length}]\``)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            msg.edit({embeds:[pages[count],ask]}).then(messg => {
                                let page = count;
                                const filter = m => m.channelId === collected.channel.id && collected.member.id === m.author.id
                                const collector2 = msg.channel.createMessageCollector({ filter, time:20000})
                                collector2.on('collect',collect => {
                                    collect.delete()
                                    page = collect.content.replace(/[^0-9]/g, '')
                                    if (page >= 1 && page <= tab.slice(0,50).length) {
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