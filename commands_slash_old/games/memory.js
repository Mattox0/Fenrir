const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('memory')
        .setDescription('Lance une partie de memory en fonction d\'un temps et d\'un montant de mot')
        .addIntegerOption(option => 
            option
            .setName('temps')
            .setDescription('temps de mémorisation')
            .setRequired(true)
            .addChoices({ name: `2 secondes`, value: 2 })
            .addChoices({ name: `5 secondes`, value: 5 })
            .addChoices({ name: `10 secondes`, value: 10 })
            .addChoices({ name: `15 secondes`, value: 15 })
            .addChoices({ name: `20 secondes`, value: 20 })
            .addChoices({ name: `30 secondes`, value: 30 }))
        .addIntegerOption(option => option.setName('cartes').setDescription('Le nombre de cartes').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let time = interaction.options.getInteger('temps');
        let nbcards = interaction.options.getInteger('cartes');
        if (nbcards > 100) return interaction.reply({content:'100 cartes maximum',ephemeral:true})
        let words = ['VERT','ROUGE','JAUNE','BLEU','VIOLET','ROSE','ORANGE']
        suite = [];
        for (let i = 0; i < nbcards; i++) {suite.push(words[Math.floor(Math.random() * words.length)])}
        const ask = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`Tu as ${time} secondes pour retenir la suite de mots !\n\n\`${suite.join('` `')}\``)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[ask]});
        await wait(1000*time);
        const reponse = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Tu as bien retenu ? Je t\'écoute !**')
            .setFooter({text :`Tu as 30 secondes`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        interaction.editReply({embeds:[reponse]}).then(msg => {
            const filter = m => m.channelId === msg.channelId && interaction.member.user.id === m.author.id
            const collector = msg.channel.createMessageCollector({ filter, max:1, time: 30000 });
            collector.on('end', collected => {
                if (!collected.first()) {
                    const delai = new EmbedBuilder()
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Les 30 secondes sont écoulés**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({ embeds: [delai], components: [] })
                }
                if (collected.first().content === suite.join(' ')) {
                    const win = new EmbedBuilder()
                        .setDescription('<a:LMT_arrow:1065548690862899240> **Bien joué, tu as réussi a retrouver ma phrase !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return collected.first().reply({embeds:[win]})
                } else {
                    let reponse = collected.first().content.split(' ')
                    let phrase = ""
                    let phraseV = ""
                    for (let i = 0; i < suite.length; i++) {
                        if (reponse[i]) {
                            if (reponse[i].toLowerCase() === suite[i].toLowerCase()) {phrase += `~~${suite[i]}~~ `;phraseV += `~~${reponse[i].toUpperCase()}~~ `}
                            else {phrase += `**${suite[i]}** `;phraseV += `**${reponse[i].toUpperCase()}** `} 
                        } else {
                            phraseV += `**${suite[i]}** `
                        }
                    }
                    const fail = new EmbedBuilder()
                        .setDescription(`<a:LMT_arrow:1065548690862899240> **Eh non, tu n\'as pas retrouvé la phrase !**\n\n> ${phrase}\n\n> ${phraseV}`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return collected.first().reply({embeds:[fail]})
                }
            })
        })
    }
}