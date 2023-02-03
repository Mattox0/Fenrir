const {Aki} = require("aki-api");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('akinator')
        .setDescription('Lance une partie d\'akinator'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const region = 'fr';
        const aki = new Aki({ region });
        await aki.start();

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('oui')
                    .setEmoji('✅')
                    .setLabel('Oui')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('non')
                    .setEmoji('❌')
                    .setLabel('Non')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('jsp')
                    .setEmoji('❓')
                    .setLabel('Je ne sais pas')
                    .setStyle(ButtonStyle.Secondary)
            )
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prob')
                    .setEmoji('👍')
                    .setLabel('Probablement')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('probpas')
                    .setEmoji('👎')
                    .setLabel('Probablement pas')
                    .setStyle(ButtonStyle.Secondary)
            )
        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setEmoji('🛑')
                    .setLabel('Arreter')
                    .setStyle(ButtonStyle.Danger)
            )
        const start = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`Question 1`)
            .setDescription(`<a:LMT_arrow:1065548690862899240> **${aki.question}**\n\n> \`Progression :\` **${Math.round(aki.progress)}%**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply()
        await interaction.editReply({embeds:[start], components:[row1, row2, row3]}).then(async (msg) => {
            let count = 1
            const filter = m => m.channelId === msg.channel.id;
            const collector = msg.channel.createMessageComponentCollector({ filter, time:120000});
            collector.on('collect', async (collected) => {
                collector.resetTimer()
                collected.deferUpdate()
                switch (collected.customId) {
                    case 'oui':
                        answer = 0;
                        break;
                    case 'non':
                        answer = 1;
                        break;
                    case 'jsp':
                        answer = 2;
                        break;
                    case 'prob':
                        answer = 3;
                        break;
                    case 'probpas':
                        answer = 4;
                        break;
                    case 'back':
                        await aki.back();
                        return
                    case 'stop':
                        collector.stop()
                        break;
                }
                await aki.step(answer);
                count++
                const step = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle(`Question ${count}`)
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **${aki.question}**\n\n> \`Progression :\` **${Math.round(aki.progress)}%**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({embeds:[step]})
                if (aki.progress >= 70 || aki.currentStep >= 78) {
                    await aki.win();
                    collector.stop();
                }
            })
            collector.on('end', async () => {
                if (aki.progress < 70 && aki.currentStep < 78) {
                    const fail = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> **La partie à été stoppé !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]});
                } else if (aki.currentStep >= 78) {
                    const fail = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> **Je ne suis pas arrivé à trouver ton personnage !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]});
                }
                let winner = aki.answers[0]
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('winner')
                            .setEmoji('🏆')
                            .setLabel('Bien joué')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('others')
                            .setEmoji('❌')
                            .setLabel('Non ! Voir les autres résultats')
                            .setStyle(ButtonStyle.Danger)
                    )
                const win = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle(`Trouvé : ${winner.name}`)
                    .setDescription(winner.description)
                    .setThumbnail(winner.absolute_picture_path)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({embeds:[win], components:[row]}).then(async (message) => {
                    const filter = m => m.channelId === message.channel.id;
                    const collector = message.channel.createMessageComponentCollector({ filter, max:1,time:60000});
                    collector.on('end', collected => {
                        if (!collected.first()) {
                            return msg.edit({components:[]});
                        }
                        switch (collected.first().customId) {
                            case 'winner':
                                return msg.edit({components:[]});
                            case 'others':
                                let tab = aki.answers.map(x => x = `${x.name} - ${x.description}`);
                                count = 1;
                                description = ``;
                                tab.forEach(elem => {
                                    description += `> **${count}#** - ${elem}\n`;
                                    count++;
                                })
                                const other = new EmbedBuilder()
                                    .setColor('#2f3136')
                                    .setTitle('Résultats :')
                                    .setDescription(description)
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                return msg.edit({embeds:[other],components:[]});
                        }
                    })

                })
            })
        })
    }
}