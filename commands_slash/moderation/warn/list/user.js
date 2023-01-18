const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    async execute(interaction, date, db) {
        let person = interaction.options.getUser('utilisateur');
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        db.all("SELECT * FROM warns WHERE user_id = ? AND guild_id = ?", person.user.id, interaction.member.guild.id, async (err, res) => {
            if (!res) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **${person} n'a aucun warn !**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]})
            }
            let debut = `Cet utilisateur a **${res.length} avertissements.**`;
            let description = [];
            let pages = [];
            let nbPage = 1;
            for (x of res) {
                let modo = await interaction.member.guild.members.cache.find(x => x.id === res.modo_id);
                description.push(`**Identifiant: ${x.warn_id}**\n**Modérateur:** ${modo}\n**Raison:** ${x.raison}\n**Date:** <t:${Math.ceil(new Date(x.warn_date) / 1000)}:F>`);
                if (description.length === 3) {
                    const page = new MessageEmbed()
                        .setColor('#2f3136')
                        .setAuthor({name:`${person.user.username}#${person.user.discriminator} (${person.user.id})`, iconURL:person.user.displayAvatarURL()})
                        .setDescription(`${debut}\n\n${description.join('\n\n')}`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbPage} / ${Math.ceil(res.length/3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    pages.push(page);
                    nbPage++;
                    description = [];
                }
            }
            if (description.length !== 0) {
                const page = new MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor({name:`${person.user.username}#${person.user.discriminator} (${person.user.id})`, iconURL:person.user.displayAvatarURL()})
                    .setDescription(`${debut}\n\n${description.join('\n\n')}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbPage} / ${Math.ceil(res.length/3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                pages.push(page);
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
                    .setDisabled(false),
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
    }
}