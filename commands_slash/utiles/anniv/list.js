const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        let listemois = ["janvier","février","mars","avril","mai","juin","juillet","aout","septembre","novembre","octobre","décembre"];
        let pages = [];
        let nbpage = 1;
        db.query('SELECT * FROM anniversaires',interaction.member.guild.id, async (err,res) => {
            if (err) return console.log("[Anniversaire list] =>  ", err);
            if (res.length === 0) {
                const error = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Il n\'y aucun anniversaire sur ce serveur !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [error]});
            };
            count = 0;
            description = "";
            let dates = [];
            let result = [];
            await interaction.member.guild.members.cache.forEach(async (member) => {
                for (let i = 0; i < res.length; i++) {
                    if (member.id === res[i].user_id) {
                        result.push(res[i]);
                    }
                }
            })
            result.forEach(async (item) => {
                count++;
                dates = item.date.split('/');
                description += `<@!${item.user_id}> <a:LMT_arrow:1065548690862899240> **${dates[0]} ${listemois[parseInt(dates[1]) - 1]}**\n\n`;
                if (count === 10) {
                    count = 0;
                    const page = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setTitle('Voici la liste des anniversaires :')
                        .setDescription(description)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${nbpage}/${pages.length}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    pages.push(page);
                    nbpage++;
                }
            })
            if (nbpage === 1) {
                const page = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(description)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [page]});
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
                    isComponent = true;
                    msg.components[0].components[3].setDisabled(false);
                    msg.components[0].components[2].setDisabled(false);
                }
                const filter = interaction => interaction.message.id === msg.id;
                const collector = msg.channel.createMessageComponentCollector({ filter, time:60000});
                collector.on('collect', collected => {
                    switch (collected.customId) {
                        case '1':
                            count = 0; 
                            if (isComponent) {
                                msg.components[0].components[0].setDisabled(true);
                                msg.components[0].components[1].setDisabled(true);
                                msg.components[0].components[3].setDisabled(false);
                                msg.components[0].components[2].setDisabled(false);
                            }
                            msg.edit({embeds:[pages[count]],components:[row]});
                            break
                        case '-1':
                            count = count - 1;
                            if (isComponent) {
                                if (count === 0) {
                                    msg.components[0].components[0].setDisabled(true)
                                    msg.components[0].components[1].setDisabled(true)
                                    msg.components[0].components[3].setDisabled(false)
                                    msg.components[0].components[2].setDisabled(false)
                                } else {
                                    msg.components[0].components[0].setDisabled(false)
                                    msg.components[0].components[1].setDisabled(false)
                                    msg.components[0].components[3].setDisabled(true)
                                    msg.components[0].components[2].setDisabled(true)
                                }
                            }
                            msg.edit({embeds:[pages[count]],components:[row]});
                            break
                        case '+1':
                            count = count + 1;
                            if (isComponent) {
                                if (count === pages.length - 1) {
                                    msg.components[0].components[3].setDisabled(true);
                                    msg.components[0].components[2].setDisabled(true);
                                    msg.components[0].components[1].setDisabled(false);
                                    msg.components[0].components[0].setDisabled(false);
                                } else {
                                    msg.components[0].components[3].setDisabled(false);
                                    msg.components[0].components[2].setDisabled(false);
                                    msg.components[0].components[1].setDisabled(true);
                                    msg.components[0].components[0].setDisabled(true);
                                }
                            }
                            msg.edit({embeds:[pages[count]],components:[row]});
                            break;
                        case '2':
                            count = pages.length - 1;
                            if (isComponent) {
                                msg.components[0].components[3].setDisabled(true);
                                msg.components[0].components[2].setDisabled(true);
                                msg.components[0].components[0].setDisabled(false);
                                msg.components[0].components[1].setDisabled(false);
                            }
                            msg.edit({embeds:[pages[count]],components:[row]});
                            break;
                    }
                })
                collector.on('end', () => {
                    msg.edit({embeds:[pages[count]],components:[]});
                })
            })
        })
    }
}