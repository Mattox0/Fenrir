const { EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let bot = interaction.options.getBoolean('bot');
        let online = interaction.options.getBoolean('online');
        await interaction.deferReply();
        db.query("SELECT stats_id, stats_bot_id, stats_online_id FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) {return console.log("Setup stats -> ", err)}
            if (res.length === 0) {return interaction.reply('Je ne trouve pas votre serveur, merci de me re-inviter, sinon contacter le support (mes MPs)')}
            res = res[0]
            if (res.stats_id !== null) {
                allMembers = await interaction.member.guild.members.cache.find(x => x.id === res.stats_id);
            }
            let count = 1;
            let allCount = 1;
            if (bot) allCount++;
            if (online) allCount++;
            const ask = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Quel nom aura votre salon \`Membres\` ?**\n\n> <a:LMT__attention:924423639431020574> Mettre {nb}\n> Exemple : \`Membres : {nb}\`')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ 1 / ${allCount}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            interaction.editReply({embeds:[ask]}).then(async msg => {
                await (new Promise((resolve, reject) => {
                    const filter = m => m.author.id === interaction.member.user.id && m.channelId === msg.channel.id
                    const collector = msg.channel.createMessageCollector({filter, time : 60000})
                    collector.on('collect', collected => {
                        collected.delete()
                        if (collected.content.length > 30 || !collected.content.includes('{nb}') || collected.content.includes('\n')) {
                            ask.setDescription('<a:LMT_arrow:1065548690862899240> **Quel nom aura votre salon \`Membres\` ?**\n\n> <a:LMT__attention:924423639431020574> Mettre {nb}\n> Exemple : \`Membres : {nb}\`\n\n <a:LMT_arrow:1065548690862899240> Votre message est trop long, ou il ne contient pas \`{nb}\`')
                            msg.edit({embeds:[ask]})
                        } else {
                            collector.stop()
                        }
                    })
                    collector.on('end',async collect => {
                        if (!collect.first() || collect.first().content.length > 30 || !collect.first().content.includes('{nb}') || collect.first().content.includes('\n')) {
                            const fail = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setDescription('<a:LMT_arrow:1065548690862899240> **Il faut se décider avant Noel !**')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ 1 / ${allCount}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({embeds:[fail]})
                        }
                        let allMembers = await interaction.member.guild.channels.cache.find(x => x.id === res.stats_id);
                        nb = interaction.member.guild.memberCount;
                        if (!allMembers) {
                            allMembers = await interaction.member.guild.channels.create({
                                name: collect.first().content.replace('{nb}',nb), 
                                type: ChannelType.GuildVoice,
                                position : 1,
                                permissionOverwrites: [{
                                    id: interaction.member.guild.id,
                                    deny: [PermissionsBitField.Flags.Connect]
                                }] 
                            });
                        } else {
                            allMembers.setName(collect.first().content.replace('{nb}',nb))
                        }
                        db.query("UPDATE servers SET stats_id = ?, stats_message = ? WHERE guild_id = ?", [allMembers.id, collect.first().content, interaction.member.guild.id], (err) => {if (err) {console.log(err);}})
                        resolve()
                    })
                }))
                if (bot) {
                    count++;
                    await (new Promise( async (resolve, reject) => {
                        const askBot = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription('<a:LMT_arrow:1065548690862899240> **Quel nom aura votre salon \`Bot\` ?**\n\n> <a:LMT__attention:924423639431020574> Mettre {nb}\n> Exemple : \`Bots : {nb}\`')
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${count} / ${allCount}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        await msg.edit({embeds:[askBot]})
                        const filter = m => m.author.id === interaction.member.user.id && m.channelId === msg.channel.id
                        const collector = msg.channel.createMessageCollector({filter, time : 60000})
                        collector.on('collect', collected => {
                            collected.delete()
                            if (collected.content.length > 30 || !collected.content.includes('{nb}') || collected.content.includes('\n')) {
                                ask.setDescription('<a:LMT_arrow:1065548690862899240> **Quel nom aura votre salon \`Bot\` ?**\n\n> <a:LMT__attention:924423639431020574> Mettre {nb}\n> Exemple : \`Bots : {nb}\`\n\n <a:LMT_arrow:1065548690862899240> Votre message est trop long, ou il ne contient pas \`{nb}\`')
                                msg.edit({embeds:[ask]})
                            } else {
                                collector.stop()
                            }
                        })
                        collector.on('end',async collect => {
                            if (!collect.first() || collect.first().content.length > 30 || !collect.first().content.includes('{nb}') || collect.first().content.includes('\n')) {
                                const fail = new EmbedBuilder()
                                    .setColor('#2f3136')
                                    .setDescription('<a:LMT_arrow:1065548690862899240> **Il faut se décider avant Noel !**')
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ 2 / ${allCount}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                return msg.edit({embeds:[fail]})
                            }
                            let nbBot = await interaction.member.guild.channels.cache.find(x => x.id === res.stats_bot_id);
                            let nb = await interaction.member.guild.members.cache.filter(x => x.user.bot).size;
                            if (!nbBot) {
                                nbBot = await interaction.member.guild.channels.create({
                                    name: collect.first().content.replace('{nb}',nb), 
                                    type: ChannelType.GuildVoice,
                                    position : 1,
                                    permissionOverwrites: [{
                                        id: interaction.member.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect]
                                    }] 
                                });
                            } else {
                                nbBot.setName(collect.first().content.replace('{nb}',nb))
                            }
                            db.query("UPDATE servers SET stats_bot_id = ?, stats_bot_message = ? WHERE guild_id = ?", [nbBot.id,collect.first().content, interaction.member.guild.id], (err) => {if (err) console.log(err) })
                            resolve()
                        })
                    }))
                }
                if (online) {
                    count++;
                    await (new Promise( async (resolve, reject) => {
                        const askBot = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription('<a:LMT_arrow:1065548690862899240> **Quel nom aura votre salon \`En ligne\` ?**\n\n> <a:LMT__attention:924423639431020574> Mettre {nb}\n> Exemple : \`Membres en ligne : {nb}\`')
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${count} / ${allCount}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        await msg.edit({embeds:[askBot]})
                        const filter = m => m.author.id === interaction.member.user.id && m.channelId === msg.channel.id
                        const collector = msg.channel.createMessageCollector({filter, time : 60000})
                        collector.on('collect', collected => {
                            collected.delete()
                            if (collected.content.length > 30 || !collected.content.includes('{nb}') || collected.content.includes('\n')) {
                                ask.setDescription('<a:LMT_arrow:1065548690862899240> **Quel nom aura votre salon \`En ligne\` ?**\n\n> <a:LMT__attention:924423639431020574> Mettre {nb}\n> Exemple : \`Membres en ligne : {nb}\`\n\n <a:LMT_arrow:1065548690862899240> Votre message est trop long, ou il ne contient pas \`{nb}\`')
                                msg.edit({embeds:[ask]})
                            } else {
                                collector.stop()
                            }
                        })
                        collector.on('end',async collect => {
                            if (!collect.first() || collect.first().content.length > 30 || !collect.first().content.includes('{nb}') || collect.first().content.includes('\n')) {
                                const fail = new EmbedBuilder()
                                    .setColor('#2f3136')
                                    .setDescription('<a:LMT_arrow:1065548690862899240> **Il faut se décider avant Noel !**')
                                    .setFooter({text :`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)} ・ ${count} / ${allCount}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                return msg.edit({embeds:[fail]})
                            }
                            let nbOnline = await interaction.member.guild.channels.cache.find(x => x.id === res.stats_online_id);
                            guildWithPresence = await interaction.member.guild.members.fetch({withPresences : true});
                            let onlines = guildWithPresence.filter((online) => online.presence?.status === "online" || online.presence?.status === "idle" || online.presence?.status === "dnd").size;
                            if (!nbOnline) {
                                nbOnline = await interaction.member.guild.channels.create({
                                    name: collect.first().content.replace('{nb}',onlines),  
                                    type: ChannelType.GuildVoice,
                                    position : 1,
                                    permissionOverwrites: [{
                                        id: interaction.member.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect]
                                    }]
                                });
                            } else {
                                nbOnline.setName(collect.first().content.replace('{nb}',onlines))
                            }
                            db.query("UPDATE servers SET stats_online_id = ?, stats_online_message = ? WHERE guild_id = ?", [nbOnline.id ,collect.first().content, interaction.member.guild.id], (err) => {if (err) console.log(err) })
                            resolve()
                        })
                    }))
                }
                const win = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Les salons sont créés et seront mis à jour toutes les 10 minutes.**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return msg.edit({embeds:[win]});
            })
        })
    }
}