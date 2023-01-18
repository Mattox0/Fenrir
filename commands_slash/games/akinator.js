const {Aki} = require("aki-api");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

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

        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('oui')
                    .setEmoji('✅')
                    .setLabel('Oui')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('non')
                    .setEmoji('❌')
                    .setLabel('Non')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('jsp')
                    .setEmoji('❓')
                    .setLabel('Je ne sais pas')
                    .setStyle('SECONDARY')
            )
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prob')
                    .setEmoji('👍')
                    .setLabel('Probablement')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('probpas')
                    .setEmoji('👎')
                    .setLabel('Probablement pas')
                    .setStyle('SECONDARY')
            )
        const row3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('back')
                    .setEmoji('↪️')
                    .setLabel('Arrière')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('stop')
                    .setEmoji('🛑')
                    .setLabel('Arreter')
                    .setStyle('DANGER')
            )
        const start = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle(`Question 1`)
            .setDescription(`<a:LMT__arrow:831817537388937277> **${aki.question}**\n\n> \`Progression :\` **${Math.round(aki.progress)}%**`)
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
                const step = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle(`Question ${count}`)
                    .setDescription(`<a:LMT__arrow:831817537388937277> **${aki.question}**\n\n> \`Progression :\` **${Math.round(aki.progress)}%**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await msg.edit({embeds:[step]})
                if (aki.progress >= 70 || aki.currentStep >= 78) {
                    await aki.win();
                    collector.stop();
                }
            })
            collector.on('end', async () => {
                if (aki.progress < 70 && aki.currentStep < 78) {
                    const fail = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT__arrow:831817537388937277> **La partie à été stoppé !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]});
                } else if (aki.currentStep >= 78) {
                    const fail = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT__arrow:831817537388937277> **Je ne suis pas arrivé à trouver ton personnage !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]});
                }
                let winner = aki.answers[0]
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('winner')
                            .setEmoji('🏆')
                            .setLabel('Bien joué')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('others')
                            .setEmoji('❌')
                            .setLabel('Non ! Voir les autres résultats')
                            .setStyle('DANGER')
                    )
                const win = new MessageEmbed()
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
                                const other = new MessageEmbed()
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