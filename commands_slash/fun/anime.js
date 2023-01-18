const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Donne toutes les informations sur un animé')
        .addStringOption(option => option.setName('animé').setDescription('l\'animé en question | Exemple : "Attack on titans" | priviligiez les noms en anglais ou japonais').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let arg = interaction.options.getString('animé');
        let query = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType) {  
            Page (page: $page, perPage: $perPage) {    
                pageInfo {      
                    total      
                    currentPage      
                    lastPage      
                    hasNextPage      
                    perPage    
                }    
                media (id: $id, search: $search, type: $type) {      
                    episodes
                    description
                    coverImage {
                        large
                        color
                    }
                    bannerImage    
                    title {        
                        english
                        romaji      
                    }
                }  
            }
        }
        `;
        var variables = {    
            search: arg,
            type: "ANIME"
        };

        let url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            };
        fetch(url, options)
        .then(handleResponse)
        .then(handleData)
        .catch(handleError)
        function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        }
        async function handleData(data) {
            let pages = [];
            let count = 1;
            if (data.data.Page.media.length === 0) {
                const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **L'animé demandé n'a pas été trouvé**\n\n> \`priviligiez les noms en anglais ou japonais\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [ fail ]});
            } 
            for (x of data.data.Page.media) {
                let color;
                let title;
                let episode;
                x.coverImage.color ? color = x.coverImage.color : color = '#2f3136';
                x.title.english ? title = `*${x.title.english}*\n` : title = "";
                x.title.romaji ? title += `*${x.title.romaji}*\n` : title += "";
                x.episodes ? episode = `\n\nNombres d'épisodes : **${x.episodes}**` : episode = "";
                description = x.description.replaceAll('<i>','');
                description = description.replaceAll('</i>','');
                description = description.replaceAll('<br>','');
                description = description.replaceAll('<b>','');
                description = description.replaceAll('</b>','');
                description = description.replaceAll('<strong>','');
                description = description.replaceAll('</strong>','');
                const page = new MessageEmbed()
                    .setColor(color)
                    .setTitle(`Résultat pour ${arg} `)
                    .setImage(x.coverImage.large)
                    .setDescription(`${title}\n**Synopsis**:\n${description}${episode}`)
                    .setFooter({text :`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${count}/${data.data.Page.media.length}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                pages.push(page);
                count++;
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
                                .setDescription(`<a:LMT__arrow:831817537388937277> **Quel page tu veux voir ?** \`[1 - ${pages.length - 1}]\``)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            msg.edit({embeds:[pages[count],ask]}).then(messg => {
                                let page = count;
                                const filter = m => m.channelId === collected.channel.id && collected.member.id === m.author.id;
                                const collector2 = msg.channel.createMessageCollector({ filter, time:20000});
                                collector2.on('collect',collect => {
                                    collect.delete();
                                    page = collect.content.replace(/[^0-9]/g, '')
                                    if (page >= 1 && page <= pages.length - 1) {
                                        collector2.stop();
                                    } else {
                                        messg.channel.send('Nombre incorrect !').then(async msg => {
                                            await wait(1000);
                                            msg.delete();
                                        })
                                    }
                                })
                                collector2.on('end', collect => {
                                    if (!collect) {
                                        msg.edit({embeds:[pages[count]],components:[row]});
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
                                        msg.edit({embeds:[pages[count2]],components:[row]});
                                    }
                                })
                            })

                    }
                })
                collector.on('end', () => {
                    msg.edit({embeds:[pages[count]],components:[]});
                })
            })

        }
        function handleError(error) {
            console.log(error);
        }
    }
}