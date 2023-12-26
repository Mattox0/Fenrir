const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Entame un pierre feuille ciseau avec un adversaire')
        .addUserOption(option => option.setName('utilisateur').setDescription('Votre adversaire').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let player1 = interaction.member;
        let player2 = interaction.options.getUser('utilisateur');
        if (!player2) {
            let choix = ['✂️','<:LMT_rock:912309329519079454>','🗞️'];
            let msgmember = 'Choisis...';
            let emoji1 = choix[Math.floor(Math.random() * choix.length)];
            let emoji2;
            const choixR = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('Pierre')
                        .setEmoji('912309329519079454')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('Feuille')
                        .setLabel('🗞️')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('Ciseau')
                        .setLabel('✂️')
                        .setStyle(ButtonStyle.Success),
                )
            const game = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle(`${player1.user.username} ✂️<:LMT_rock:912309329519079454>🗞️ LMT-Bot`)
                .addFields(
                    {name:`${player1.user.username}`,value:`${msgmember}`,inline:true},
                    {name:`VS`,value:`⚡`,inline:true},
                    {name:`LMT-Bot`,value:`A choisi !`,inline:true},
                )
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await interaction.deferReply();
            interaction.editReply({embeds:[game],components: [choixR]}).then(msg => {
                const filter = interraction => interraction.user.id == player1.user.id && interraction.message.id == msg.id
                const collector = msg.channel.createMessageComponentCollector({
                    filter,
                    max: 1,
                    time: 60000
                })
                collector.on('end', async collected => {
                    if (!collected.first()) {
                        const delai = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT_arrow:1065548690862899240> **Décide toi avant noël la prochaine fois !**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({ embeds: [delai], components: [] })
                    };
                    switch (collected.first().customId) {
                        case 'Ciseau':
                            emoji2 = '✂️';
                            break
                        case 'Pierre':
                            emoji2 = '<:LMT_rock:912309329519079454>';
                            break
                        case 'Feuille':
                            emoji2 = '🗞️';
                            break
                    }
                    if (emoji1 === emoji2) {
                        resultat = 'Egalité ! une revanche ?'
                    } else if ((emoji1 === '✂️' && emoji2 === '🗞️') || (emoji1 === '🗞️' && emoji2 === '<:LMT_rock:912309329519079454>') || (emoji1 === '<:LMT_rock:912309329519079454>' && emoji2 === '✂️')) {
                        resultat = `LMT-Bot a gagné !`
                    } else {
                        resultat = `${player1.user.username} a gagné !`
                    }
                    const game = new EmbedBuilder()
                        .setColor('#FFFFFF')
                        .setTitle(`${player1.user.username} ✂️<:LMT_rock:912309329519079454>🗞️ LMT-Bot`)
                        .addFields(
                            {name:`${player1.user.username}`,value:`${emoji2}`,inline:true},
                            {name:`VS`,value:`⚡`,inline:true},
                            {name:`LMT-Bot`,value:`${emoji1}`,inline:true},
                            {name:`Résultat`,value:`${resultat}`,inline:false},
                        )
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[game],components: []})
                })
            })
        } else {
            let person = await interaction.member.guild.members.cache.find(x => x.id === player2.id);
            const duel = new EmbedBuilder()
                .setColor('#ffffff')
                .setDescription(`**${person}**, Acceptes-tu ce Pierre Feuille Ciseau de la part de **${player1}** ?`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('Oui')
                        .setLabel('Oui')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('Non')
                        .setLabel('Non')
                        .setStyle(ButtonStyle.Danger),
                )
            await interaction.deferReply();
            interaction.editReply({ embeds: [duel], components: [row] }).then(msg => {
                const filter = interraction => interraction.user.id == person.id && interraction.message.id == msg.id
                const collector = msg.channel.createMessageComponentCollector({
                    filter,
                    max: 1,
                    time: 60000
                })
                collector.on('end', async collected => {
                    if (!collected.first()) {
                        const delai = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT_arrow:1065548690862899240> **${person} n'a pas répondu...**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({ embeds: [delai], components: [] })
                    };
                    collected.first().deferUpdate(); // évite le chargement infinie de l'intérraction
                    switch (collected.first().customId) {
                        case 'Oui':
                            const choix = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('Pierre')
                                    .setEmoji('912309329519079454')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('Feuille')
                                    .setLabel('🗞️')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('Ciseau')
                                    .setLabel('✂️')
                                    .setStyle(ButtonStyle.Success),
                            )
                            let msgperson = "Choisis ...";
                            let msgmember = "Choisis ...";
                            let emoji1;
                            let emoji2;
                            const game = new EmbedBuilder()
                                .setColor('#FFFFFF')
                                .setTitle(`${player1.user.username} ✂️<:LMT_rock:912309329519079454>🗞️ ${person.user.username}`)
                                .addFields(
                                    {name:`${player1.user.username}`,value:`${msgmember}`,inline:true},
                                    {name:`VS`,value:`⚡`,inline:true},
                                    {name:`${person.user.username}`,value:`${msgperson}`,inline:true},
                                )
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'}) 
                            msg.edit({embeds:[game],components:[choix]}).then(msg => {
                                let choixperson = false;
                                let choixmessage = false;
                                const filter = interraction => (interraction.user.id == person.id || interraction.user.id == player1.user.id) && interraction.message.id == msg.id
                                const collector = msg.channel.createMessageComponentCollector({
                                    filter,
                                    time: 60000
                                })
                                collector.on('collect', collected => {
                                    if (collected.user.id === person.id) {
                                        choixperson = true
                                        msgperson = "A choisi !"
                                        switch (collected.customId) {
                                            case 'Ciseau':
                                                emoji1 = '✂️';
                                                break;
                                            case 'Pierre':
                                                emoji1 = '<:LMT_rock:912309329519079454>';
                                                break;
                                            case 'Feuille':
                                                emoji1 = '🗞️';
                                                break;
                                        }
                                    } else if (collected.user.id === player1.user.id) {
                                        choixmessage = true;
                                        msgmember = "A choisi !";
                                        switch (collected.customId) {
                                            case 'Ciseau':
                                                emoji2 = '✂️';
                                                break;
                                            case 'Pierre':
                                                emoji2 = '<:LMT_rock:912309329519079454>';
                                                break;
                                            case 'Feuille':
                                                emoji2 = '🗞️';
                                                break;
                                        }
                                    }
                                    const game = new EmbedBuilder()
                                    .setColor('#FFFFFF')
                                    .setTitle(`${player1.user.username} ✂️<:LMT_rock:912309329519079454>🗞️ ${person.user.username}`)
                                    .addFields(
                                        {name:`${player1.user.username}`,value:`${msgmember}`,inline:true},
                                        {name:`VS`,value:`⚡`,inline:true},
                                        {name:`${person.user.username}`,value:`${msgperson}`,inline:true},
                                    )
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                    msg.edit({embeds:[game]});
                                    if (choixperson && choixmessage) {
                                        collector.stop();
                                    }
                                })
                                collector.on('end', () => {
                                    if (!choixperson || !choixmessage) {
                                        const fail = new EmbedBuilder()
                                            .setColor('#2f3136')
                                            .setDescription(`<a:LMT_arrow:1065548690862899240> **Un de vous s'est défilé et n'as pas répondu !**`)
                                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                        return msg.edit({embeds:[fail],components: []});
                                    }
                                    let resultat;
                                    if (emoji1 === emoji2) {
                                        resultat = 'Egalité ! une revanche ?';
                                    } else if ((emoji1 === '✂️' && emoji2 === '🗞️') || (emoji1 === '🗞️' && emoji2 === '<:LMT_rock:912309329519079454>') || (emoji1 === '<:LMT_rock:912309329519079454>' && emoji2 === '✂️')) {
                                        resultat = `${person} a gagné !`;
                                    } else {
                                        resultat = `${player1} a gagné !`;
                                    }
                                    const game = new EmbedBuilder()
                                    .setColor('#FFFFFF')
                                    .setTitle(`${player1.user.username} ✂️<:LMT_rock:912309329519079454>🗞️ ${person.user.username}`)
                                    .addFields(
                                        {name:`${player1.user.username}`,value:`${emoji2}`,inline:true},
                                        {name:`VS`,value:`⚡`,inline:true},
                                        {name:`${person.user.username}`,value:`${emoji1}`,inline:true},
                                        {name:`Résultat`,value:`${resultat}`,inline:false},
                                    )
                                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                    msg.edit({embeds:[game],components: []});
                                })
                            })
                            break;
                        case 'Non':
                            const fuite = new EmbedBuilder()
                                .setColor('#2f3136')
                                .setTitle(`${player2.user.username} n'a pas voulu t'affronter`)
                                .setDescription(`${player2.user.username} a pris la fuite comme un pokémon sauvage`)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({ embeds: [fuite], components: [] })
                    }
                })
            })
        }
    }
}