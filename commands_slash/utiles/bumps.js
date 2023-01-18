const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bumps')
        .setDescription('Affiche le tableau de bumps de votre serveur'),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        db.get('SELECT bumps_id FROM servers WHERE guild_id = ?', interaction.guild.id, (err, res) => {
            if (err || !res) {
                return console.log(err);
            }
            if (res.bumps_id === null || res.bumps_id === false) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Ton serveur n\'a pas activé le système de bumps !**\n\n> `/setup bumps`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail], ephemeral:true})
            }
            let allBumps = []
            let pages = [];
            db.all('SELECT * FROM bumps WHERE guild_id = ?',interaction.guild.id, async (err, res) => {
                if (!res) {
                    const fail = new MessageEmbed()
                        .setColor('#2f3631')
                        .setDescription('<a:LMT__arrow:831817537388937277> **Aucun bumps n\'a été effectué dans ce serveur !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.reply({embeds:[fail]})
                }
                for (x of res) {
                    allBumps.push([x.user_id,x.count_bumps,x.last_bump]) 
                }
                allBumps.sort(compareSecondColumn)
                let description = [];
                let nbPage = 1;
                for (let [index, x] of allBumps.entries()) {
                    let user_id = x[0]
                    let count = x[1]
                    let last_bump = x[2]
                    if (index === 0) description.push(`#🥇 <@${user_id}> **-** ${count} bumps **-** <t:${last_bump}:D>`)
                    else if (index === 1) description.push(`#🥈 <@${user_id}> **-** ${count} bumps **-** <t:${last_bump}:D>`)
                    else if (index === 2) description.push(`#🥉 <@${user_id}> **-** ${count} bumps **-** <t:${last_bump}:D>`)
                    else description.push(`#${index+1}. <@${user_id}> **-** ${count} bumps **-** <t:${last_bump}:D>`)
                    if (index%10===0 && index !== 0) {
                        const page = new MessageEmbed()
                            .setColor('#2f3631')
                            .setDescription(description.join('\n\n'))
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbPage} / ${pages.length+1}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        pages.push(page);
                        nbPage++;
                        description = [];
                    }
                }
                if (description.length != 0) {
                    const page = new MessageEmbed()
                        .setColor('#2f3631')
                        .setDescription(description.join('\n\n'))
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbPage} / ${pages.length+1}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
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
                                    .setDescription(`<a:LMT__arrow:831817537388937277> **Quel page tu veux voir ?** \`[1 - ${Math.ceil(res.length/3)}]\``)
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
            })

            function compareSecondColumn(a, b) {
                if (a[1] === b[1]) {
                    return 0;
                }
                else {
                    return (a[1] < b[1]) ? 1 : -1;
                }
            }
        })
    }
}