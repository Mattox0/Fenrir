const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('puissance4')
        .setDescription('Entame un puissance 4 avec un adversaire')
        .addUserOption(option => option.setName('utilisateur').setDescription('Votre adversaire').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let player2 = interaction.options.getUser('utilisateur');
        player2 = await interaction.member.guild.members.cache.find(x => x.id === player2.id);
        let player1 = interaction.member;
        let bleu = '<:bleu:913854027320660049>';
        let rouge = '<:red:913853343837855786>';
        let gris = '<:gris:913851890373132388>';
        let fleche = '<:LMT__left:913873419249016862>';
        let transparent = '<:transparent:913875846178172980>';
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Oui')
                    .setLabel('Oui')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('Non')
                    .setLabel('Non')
                    .setStyle('DANGER')
            )
        const ask = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **${player2}, Acceptes-tu le puissance4 proposé par ${player1} ? **`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply();
        interaction.editReply({embeds:[ask],components:[row]}).then(msg => {
            const filter = interaction => interaction.message.id === msg.id && interaction.user.id === player2.id
            const collector = msg.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 60000
            })
            collector.on('end', collected => {
                if (!collected.first()) {
                    const fail = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__arrow:831817537388937277> **${player2} n'a pas répondu !**`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]})
                }
                switch (collected.first().customId) {
                    case 'Oui':
                        let temp = []
                        collected.first().deferUpdate()
                        for (let x = 0; x < 6; x++) {
                            temp[x] = Array(7).fill(gris);
                        }
                        let board = []
                        for (let i = 0;i < 6;i++) {
                            board.push(temp[i].join(' '))
                        }
                        trans = Array(7).fill(transparent)
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
                                new MessageButton()
                                .setCustomId('4')
                                .setEmoji('4️⃣')
                                .setStyle('SECONDARY')
                        )
                        const numeros2 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('5')
                                .setEmoji('5️⃣')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('6')
                                .setEmoji('6️⃣')
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('7')
                                .setEmoji('7️⃣')
                                .setStyle('SECONDARY')
                        )
                        const tab = new MessageEmbed()
                            .setColor('#2f3136')
                            .setTitle('Puissance 4')
                            .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
                             ${trans.join(' ')}
                             ${board.join('\n')}
                            
                            ${bleu} ${player1} ${fleche}
                            ${rouge} ${player2}`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({embeds:[tab],components:[numeros1,numeros2]}).then(msg => {
                            game(msg,temp,numeros1,numeros2, player1, player2)
                        })
                        break
                    case 'Non':
                        const no = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT__arrow:831817537388937277> **${player2} a refusé ta demande !**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({embeds:[no],components:[]})
                }
            })
        })

        function game(msg,temp,numeros1,numeros2, player1, player2) {
            let bleu = '<:bleu:913854027320660049>'
            let rouge = '<:red:913853343837855786>'
            let gris = '<:gris:913851890373132388>'
            let transparent = '<:transparent:913875846178172980>'
            let victoire
            let board = temp
            let moves = 0
            let turn = player1
            const filter = interaction => interaction.message.id === msg.id && (interaction.user.id===player1.id || interaction.user.id===player2.id)
            const collector = msg.channel.createMessageComponentCollector({filter, time:60000})
            collector.on('collect', collected => {
                collector.resetTimer();
                if (turn.id === collected.user.id) {
                    let column = parseInt(collected.customId-1)
                    let row;
                    for (let i = 5; i >= 0; i--) {
                        if (board[i][column] == gris) {
                            row = i;
                            break;
                        }
                    }
                    board[row][column] = turn===player1 ? bleu : rouge;
                    moves++
                    if (row === 0) {
                        switch (collected.customId) {
                            case '1':
                                numeros1.components[0].setDisabled(true)
                                break;
                            case '2':
                                numeros1.components[1].setDisabled(true)
                                break;
                            case '3':
                                numeros1.components[2].setDisabled(true)
                                break;
                            case '4':
                                numeros1.components[3].setDisabled(true)
                                break;
                            case '5':
                                numeros2.components[0].setDisabled(true)
                                break;
                            case '6':
                                numeros2.components[1].setDisabled(true)
                                break;
                            case '7':
                                numeros2.components[2].setDisabled(true)
                                break;
                        }
                    }
                    toPrint(msg, board, column, numeros1,numeros2, player1, player2, turn)
                    if (win(row, column, turn===player1?bleu:rouge, board)) {
                        victoire = turn
                        collector.stop()
                    }
                    if (moves === 6 * 7) {victoire='egalite';collector.stop()}
                    turn = turn === player1 ? player2 : player1
                    
                }  else {
                    const fail = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT__arrow:831817537388937277> **Ce n\'est pas ton tour !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    interaction.followUp({embeds:[fail]});
                }
                collected.deferUpdate();
            })
            collector.on('end', (collected) => {
                let tableau = []
                for (let i = 0;i < 6;i++) {
                    tableau.push(board[i].join(' '))
                }
                trans = Array(7).fill(transparent)
                if (!victoire) {
                    const timeup1 = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Puissance 4')
                    .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
                     ${trans.join(' ')}
                     ${tableau.join('\n')}
                    
                    ${player1} a déclaré forfait...
                    ${player2} remporte donc le partie !
                    
                    ${bleu} ${player1}
                    ${rouge} ${player2} Winner <:LMT__couronne:882246303726313514>`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    const timeup2 = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Puissance 4')
                    .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
                     ${trans.join(' ')}
                     ${tableau.join('\n')}
                    
                    ${player2} a déclaré forfait...
                    ${player1} remporte donc le partie !
                    
                    ${bleu} ${player1} Winner <:LMT__couronne:882246303726313514>
                    ${rouge} ${player2}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    if (turn===player1) return msg.edit({embeds:[timeup1],components:[]})
                    else return msg.edit({embeds:[timeup2],components:[]})
                }
                if (victoire === 'egalite') {
                    const egalite = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Puissance 4')
                    .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
                     ${trans.join(' ')}
                     ${tableau.join('\n')}
                    
                    Aucun de vous deux n'a gagné !
                    Une revanche ?
                    
                    ${bleu} ${player1}
                    ${rouge} ${player2}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[egalite],components:[]})
                }
                if (victoire === player1) {
                    const win1 = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Puissance 4')
                    .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
                     ${trans.join(' ')}
                     ${tableau.join('\n')}
                    
                    ${player1} remporte la partie !
                    
                    ${bleu} ${player1} Winner <:LMT__couronne:882246303726313514>
                    ${rouge} ${player2}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[win1],components:[]})
                } else {
                    const win2 = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Puissance 4')
                    .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
                     ${trans.join(' ')}
                     ${tableau.join('\n')}
                    
                    ${player2} remporte la partie !
                    
                    ${bleu} ${player1}
                    ${rouge} ${player2} Winner <:LMT__couronne:882246303726313514>`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[win2],components:[]})
                }
            })
        }

        function toPrint(msg, board,column, numeros1,numeros2, player1, player2, turn) {
            let bleu = '<:bleu:913854027320660049>'
            let rouge = '<:red:913853343837855786>'
            let fleche = '<:LMT__left:913873419249016862>'
            let transparent = '<:transparent:913875846178172980>'
            let tableau = []
            for (let i = 0;i < 6;i++) {
                tableau.push(board[i].join(' '))
            }
            trans = Array(7).fill(transparent)
            trans[column] = '🔻'
            const tab1 = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Puissance 4')
            .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
             ${trans.join(' ')}
             ${tableau.join('\n')}
            
            ${bleu} ${player1} ${fleche}
            ${rouge} ${player2}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            const tab2 = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Puissance 4')
            .setDescription(`<:LMT_one:901982492473573377> <:LMT_two:901982559456608256> <:LMT_three:901982617006657576> <:LMT_four:901982648463917056> <:LMT_five:901982703476441128> <:LMT_six:901982741493604384> <:LMT_seven:901982779489796106>
             ${trans.join(' ')}
             ${tableau.join('\n')}
            
            ${bleu} ${player1}
            ${rouge} ${player2} ${fleche}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            if (turn === player1) msg.edit({embeds:[tab2],components:[numeros1,numeros2]})
            else msg.edit({embeds:[tab1],components:[numeros1,numeros2]})
            
        }

        function win(row, column, player, board) {
            let count = 0;
            for (let j = 0; j < 7; j++) {
                count = (board[row][j] == player) ? count+1 : 0;
                if (count >= 4) return true;
            }
            count = 0
            for (let i = 0; i < 6; i++) {
                count = (board[i][column] == player) ? count+1 : 0;
                if (count >= 4) return true;
            }
            count = 0;
            let shift = row - column;
            for (let i = Math.max(shift, 0); i < Math.min(6, 7 + shift); i++) {
                count = (board[i][i - shift] == player) ? count+1 : 0;
                if (count >= 4) return true;
            }
            count = 0;
            shift = row + column;
            for (let i = Math.max(shift - 7 + 1, 0); i < Math.min(6, shift + 1); i++) {
                count = (board[i][shift - i] == player) ? count+1 : 0;
                if (count >= 4) return true;
            }
            return false;
        }
    }
}