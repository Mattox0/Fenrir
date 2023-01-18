const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('morpion')
        .setDescription('Entame un morpion avec un adversaire')
        .addUserOption(option => option.setName('utilisateur').setDescription('Votre adversaire').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let player1 = interaction.member;
        let player2 = interaction.options.getUser('utilisateur');
        player2 = await interaction.member.guild.members.cache.find(x => x.id === player2.id);
        signe1 = " ⁣ ❌ ⁣ "
        signe2 = " ⁣ ⭕ ⁣ "
        case1 = ` ⁣ :one: ⁣ `
        case2 = ` ⁣ :two: ⁣ `
        case3 = ` ⁣ :three: ⁣ `
        case4 = ` ⁣ :four: ⁣ `
        case5 = ` ⁣ :five: ⁣ `
        case6 = ` ⁣ :six: ⁣ `
        case7 = ` ⁣ :seven: ⁣ `
        case8 = ` ⁣ :eight: ⁣ `
        case9 = ` ⁣ :nine: ⁣ `
        const duel = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **${player2}, Acceptes-tu ce morpion de la part de ${player1}** ?`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Oui')
                    .setLabel('Oui')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('Non')
                    .setLabel('Non')
                    .setStyle('DANGER'),
            )
        await interaction.deferReply();
        interaction.editReply({ embeds: [duel], components: [row] }).then(msg => {
            const filter = interraction => interraction.user.id == player2.id && interraction.message.id == msg.id
            const collector = msg.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 60000
            })
            collector.on('end', async collected => {
                if (!collected.first()) {
                    const delai = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **${player2} n'a pas répondu !**`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({ embeds: [delai], components: [] })
                };
                collected.first().deferUpdate();
                switch (collected.first().customId) {
                    case 'Oui':
                        const numeros1 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('1')
                                .setEmoji('1️⃣')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('2')
                                .setEmoji('2️⃣')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('3')
                                .setEmoji('3️⃣')
                                .setStyle('SECONDARY'),
                        )
                        const numeros2 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('4')
                                .setEmoji('4️⃣')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('5')
                                .setEmoji('5️⃣')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('6')
                                .setEmoji('6️⃣')
                                .setStyle('SECONDARY'),
                        )
                        const numeros3 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('7')
                                .setEmoji('7️⃣')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('8')
                                .setEmoji('8️⃣')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('9')
                                .setEmoji('9️⃣')
                                .setStyle('SECONDARY'),
                        )
                        const debut = new MessageEmbed()
                            .setTitle(`${player1.user.username} :mag_right::mag: ${player2.username}`)
                            .setDescription(`C'est au tour de **${player1}**     
                  --------------------------
                ${case1}|${case2}|${case3}
                 --------------------------
                ${case4}|${case5}|${case6}
                 --------------------------
                ${case7}|${case8}|${case9}
                 --------------------------
                
                ❌ ${player1}
                ⭕ ${player2}`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({ embeds: [debut], components: [ numeros1,numeros2,numeros3 ]}).then(msg => {
                            game(msg, numeros1,numeros2,numeros3, player1, player2)
                        })
                        break
                    case 'Non':
                        const fuite = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT__arrow:831817537388937277> **${player2} a décliné ton offre !**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({ embeds: [fuite], components: [] })
                }
            })
        })

        async function game(msg, numeros1,numeros2,numeros3,player1,player2) {
            let turn = player1
            let win
            let sign
            let count = 0
            const filter = interraction => interraction.message.id === msg.id && (interraction.user.id === player1.id || interraction.user.id === player2.id)
            const collector = await msg.channel.createMessageComponentCollector({filter, time:120000})
            collector.on('collect', collected => {
                collector.resetTimer()
                if (collected.user.id === turn.id) {
                    turn === player1 ? sign = signe1 : sign = signe2
                    switch(collected.customId) {
                        case '1':
                            numeros1.components[0].setDisabled(true)
                            case1 = sign
                            count++
                            break
                        case '2':
                            numeros1.components[1].setDisabled(true)
                            case2 = sign
                            count++
                            break
                        case '3':
                            numeros1.components[2].setDisabled(true)
                            case3 = sign
                            count++
                            break
                        case '4':
                            numeros2.components[0].setDisabled(true)
                            case4 = sign
                            count++
                            break
                        case '5':
                            numeros2.components[1].setDisabled(true)
                            case5 = sign
                            count++
                            break
                        case '6':
                            numeros2.components[2].setDisabled(true)
                            case6 = sign
                            count++
                            break
                        case '7':
                            numeros3.components[0].setDisabled(true)
                            case7 = sign
                            count++
                            break
                        case '8':
                            numeros3.components[1].setDisabled(true)
                            case8 = sign
                            count++
                            break
                        case '9':
                            numeros3.components[2].setDisabled(true)
                            case9 = sign
                            count++
                            break
                    }
                    turn === player1 ? turn = player2 : turn = player1
                    const morpion = new MessageEmbed()
                        .setTitle(`${player1.user.username} :mag_right::mag: ${player2.username}`)
                        .setDescription(`C'est au tour de **${turn}**     
                          --------------------------
                        ${case1}|${case2}|${case3}
                         --------------------------
                        ${case4}|${case5}|${case6}
                         --------------------------
                        ${case7}|${case8}|${case9}
                         --------------------------

                        ❌ ${player1}
                        ⭕ ${player2}`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    msg.edit({embeds:[morpion],components:[numeros1,numeros2,numeros3]})
                    collected.deferUpdate()
                }// else {
                    // envoyer message ephemere "Ce n'est pas ton tour"
                //}
                if ((case1===case2 && case1===case3) || (case4===case5 && case4===case6) || (case7===case8 && case7===case9) || (case1===case4&&case1===case7) || (case2===case5 && case2===case8) || (case3===case6&&case3===case9) || (case1===case5&&case1===case9) || (case3===case5&&case3===case7)) {
                    win = turn===player1 ? player2 : player1;
                    collector.stop()
                }
                if (count === 9) {
                    collector.stop()
                }
            })
            collector.on('end', () => {
                if (win === player1) {
                    const vic1 = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`**Victoire !**

                         --------------------------
                        ${case1}|${case2}|${case3}
                         --------------------------
                        ${case4}|${case5}|${case6}
                         --------------------------
                        ${case7}|${case8}|${case9}
                         --------------------------
                        
                        ❌ ${player1} Winner <:LMT__couronne:882246303726313514>
                        ⭕ ${player2}`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[vic1],components: []})
                } else if (win === player2) {
                    const vic2 = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`**Victoire !**

                         --------------------------
                        ${case1}|${case2}|${case3}
                         --------------------------
                        ${case4}|${case5}|${case6}
                         --------------------------
                        ${case7}|${case8}|${case9}
                         --------------------------
                        
                        ❌ ${player1}
                        ⭕ ${player2} Winner <:LMT__couronne:882246303726313514>`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[vic2],components: []})
                }
                const nul = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`**Egalité !**
                    
                     --------------------------
                    ${case1}|${case2}|${case3}
                     --------------------------
                    ${case4}|${case5}|${case6}
                     --------------------------
                    ${case7}|${case8}|${case9}
                     --------------------------

                    Aucun de vous ne remporte la partie !
                    Une revanche ?

                    ❌ ${player1}
                    ⭕ ${player2}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return msg.edit({embeds:[nul],components: []})
            })
        }
    }
}