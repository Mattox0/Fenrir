const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pendu')
        .setDescription('Lance une partie de pendu multijoueur ou en solo'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const pendu = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Veux-tu lancer une partie solitaire ou à plusieurs ?**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Solo')
                    .setLabel('Solitaire !')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('Ensemble')
                    .setLabel('Ensemble !')
                    .setStyle(ButtonStyle.Primary),
            )
        await interaction.deferReply();
        interaction.editReply({ embeds: [pendu], components: [row] }).then(msg => {
            const filter = interraction => interraction.user.id == interaction.member.user.id && interraction.message.id == msg.id
            const collector = msg.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 60000
            })
            collector.on('end', async collected => {
                if (!collected.first()) {
                    const delai = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> Décide toi avant Noël !')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({ embeds: [delai], components: [] })
                };
                collected.first().deferUpdate(); // évite le chargement infinie de l'intérraction
                switch (collected.first().customId) {
                    case 'Solo':
                        Solo(msg, interaction);
                        return;
                    case 'Ensemble':
                        Ensemble(msg);
                        return;
                }
            })
        })

        function Ensemble(msg) {
            let mots = fs.readFileSync('./commands_slash/games/pendu_words.txt','utf8');
            word = mots.split('\n').map(x => x.replace('\r',''))[Math.floor(Math.random() * mots.split('\n').length)]
            let text = fs.readFileSync('./commands_slash/games/pendu_hangman.txt','utf8');
            hangmans = [];
            hangman = "";
            count = 0;
            for (let i=0; i<text.length; i++) {
                if (text[i] === '\n') count++;
                if (count === 9) {
                    hangmans.push(hangman);
                    count = 0;
                    hangman = "";
                    continue;
                }
                hangman += text[i];
            }
            tabWordF = [];
            tabWordV = [];
            for (let i = 0; i < word.length; i++) {
                tabWordF.push('_');
                tabWordV.push(word[i].toUpperCase());
            }
            let poubelleWords = [];
            let phrase = `\`${tabWordF.join(' ')}\``;
            let poubelle = `**Aucune**`;
            const test = new EmbedBuilder()
                .setTitle('Jeu du Pendu')
                .setDescription(`${phrase}\nLettres incorrectes : ${poubelle}\n\`\`\`${hangmans[0]}\`\`\``)
                .setFooter({text:'Le temps maximum par lettre est de 1 minute !', iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            msg.edit({embeds:[test],components:[]});
            let hangmanCount = 0;
            win = false;
            motTrouvé = false;
            done = false;
            const filter = m => m.channelId === msg.channelId && tabWordF.includes('_') && hangmanCount < 6 && !motTrouvé;
            const collector = msg.channel.createMessageCollector({ filter, time: 120000 });
            collector.on('collect', collected => {
                tabWordV, tabWordF, done, motTrouvé = Letter(tabWordV, tabWordF, collected.content);
                if (motTrouvé) {
                    const win = new EmbedBuilder()
                    .setDescription(`Tu as remporté la victoire ! Le mot était bien **${word.charAt(0).toUpperCase()}${word.slice(1)}**`)
                    return msg.reply({embeds:[win],components: []})
                } else if (!done) {
                    if (!poubelleWords.includes(collected.content.toUpperCase())) {
                        hangmanCount++
                        poubelleWords.push(collected.content.toUpperCase())
                        poubelle = `**${poubelleWords.join(' ')}**`
                        const hangman = new EmbedBuilder()
                        .setTitle('Jeu du Pendu')
                        .setDescription(`${phrase}\nLettres incorrectes : ${poubelle}\n\`\`\`${hangmans[hangmanCount]}\`\`\``)
                        .setFooter({text:'Le temps maximum par lettre est de 1 minute !', iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({embeds:[hangman],components: []})
                    }
                } else {
                    phrase = `\`${tabWordF.join(' ')}\``
                    const hangman = new EmbedBuilder()
                    .setTitle('Jeu du Pendu')
                    .setDescription(`${phrase}\nLettres incorrectes : ${poubelle}\n\`\`\`${hangmans[hangmanCount]}\`\`\``)
                    .setFooter({text:'Le temps maximum par lettre est de 1 minute !', iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    msg.edit({embeds:[hangman],components: []})
                }
                collected.delete()
                if (!tabWordF.includes('_')) {
                    const win = new EmbedBuilder()
                    .setDescription(`Tu as remporté la victoire ! Le mot était bien **${word.charAt(0).toUpperCase()}${word.slice(1)}**`)
                    return msg.reply({embeds:[win],components: []})
                } else if (hangmanCount === 6) {
                    const defeat = new EmbedBuilder()
                    .setDescription(`Tu as perdu ! Le mot a trouver était **${word.charAt(0).toUpperCase()}${word.slice(1)}** !`)
                    return msg.reply({embeds:[defeat],components:[]})
                }
            });
            collector.on('end', collected => {
                if (!tabWordF.includes('_') || hangmanCount === 6 || motTrouvé) return
                const delai = new EmbedBuilder()
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Tu as pris trop de temps, recommence !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return msg.edit({ embeds: [delai], components: [] })
            })
        }

        function Solo(msg,interaction) {
            let mots = fs.readFileSync('./commands_slash/games/pendu_words.txt','utf8')
            word = mots.split('\n').map(x => x.replace('\r',''))[Math.floor(Math.random() * mots.split('\n').length)]
            let text = fs.readFileSync('./commands_slash/games/pendu_hangman.txt','utf8')
            hangmans = []
            hangman = ""
            count = 0
            for (let i=0; i<text.length; i++) {
                if (text[i] === '\n') count++
                if (count === 9) {
                    hangmans.push(hangman)
                    count = 0
                    hangman = ""
                    continue
                }
                hangman += text[i]
            }
            tabWordF = []
            tabWordV = []
            for (let i = 0; i < word.length; i++) {
                tabWordF.push('_')
                tabWordV.push(word[i].toUpperCase())
            }
            let poubelleWords = []
            let phrase = `\`${tabWordF.join(' ')}\``
            let poubelle = `**Aucune**`
            const test = new EmbedBuilder()
                .setTitle('Jeu du Pendu')
                .setDescription(`${phrase}\nLettres incorrectes : ${poubelle}\n\`\`\`${hangmans[0]}\`\`\``)
                .setFooter({text:'Le temps maximum par lettre est de 1 minute !', iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            msg.edit({embeds:[test],components:[]})
            let hangmanCount = 0
            win = false
            motTrouvé = false
            done = false
            const filter = m => m.channelId === msg.channelId && m.author.id === interaction.member.user.id && tabWordF.includes('_') && hangmanCount < 6 && !motTrouvé
            const collector = msg.channel.createMessageCollector({ filter, time: 120000 });
            collector.on('collect', collected => {
                tabWordV, tabWordF, done, motTrouvé = Letter(tabWordV, tabWordF, collected.content)
                if (motTrouvé) {
                    const win = new EmbedBuilder()
                    .setDescription(`Tu as remporté la victoire ! Le mot était bien **${word.charAt(0).toUpperCase()}${word.slice(1)}**`)
                    return msg.reply({embeds:[win],components: []})
                } else if (!done) {
                    if (!poubelleWords.includes(collected.content.toUpperCase())) {
                        hangmanCount++
                        poubelleWords.push(collected.content.toUpperCase())
                        poubelle = `**${poubelleWords.join(' ')}**`
                        const hangman = new EmbedBuilder()
                        .setTitle('Jeu du Pendu')
                        .setDescription(`${phrase}\nLettres incorrectes : ${poubelle}\n\`\`\`${hangmans[hangmanCount]}\`\`\``)
                        .setFooter({text:'Le temps maximum par lettre est de 1 minute !', iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({embeds:[hangman],components: []})
                    }
                } else {
                    phrase = `\`${tabWordF.join(' ')}\``
                    const hangman = new EmbedBuilder()
                    .setTitle('Jeu du Pendu')
                    .setDescription(`${phrase}\nLettres incorrectes : ${poubelle}\n\`\`\`${hangmans[hangmanCount]}\`\`\``)
                    .setFooter({text:'Le temps maximum par lettre est de 1 minute !', iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    msg.edit({embeds:[hangman],components: []})
                }
                collected.delete()
                if (!tabWordF.includes('_')) {
                    const win = new EmbedBuilder()
                    .setDescription(`Tu as remporté la victoire ! Le mot était bien **${word.charAt(0).toUpperCase()}${word.slice(1)}**`)
                    return msg.reply({embeds:[win],components: []})
                } else if (hangmanCount === 6) {
                    const defeat = new EmbedBuilder()
                    .setDescription(`Tu as perdu ! Le mot a trouver était **${word.charAt(0).toUpperCase()}${word.slice(1)}** !`)
                    return msg.reply({embeds:[defeat],components:[]})
                }
            });
            collector.on('end', () => {
                if (!tabWordF.includes('_') || hangmanCount === 6 || motTrouvé) return
                const delai = new EmbedBuilder()
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Tu as pris trop de temps, recommence !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return msg.edit({ embeds: [delai], components: [] })
            })
        }
        
        function Letter(tabWordV, tabWordF, letter) {
            done = false;
            motTrouvé = false;
            if (letter.length != 1 && letter.toUpperCase() === tabWordV.join('')) {
                motTrouvé = true;
            } else {
                for (let x=0; x<tabWordV.length; x++) {
                    if (letter.toUpperCase() === tabWordV[x].toUpperCase()) {
                        tabWordF[x] = letter.toUpperCase();
                        done = true;
                    }
                }
            }
            return tabWordV, tabWordF, done, motTrouvé;
        }
    }
}