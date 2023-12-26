const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Lancez une partie de roulette avec vos amis'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const ask = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Participe')
                    .setLabel('Je participe !')
                    .setStyle(ButtonStyle.Primary),
            )
        const debut = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`<a:LMT_arrow:1065548690862899240> **Appuyez sur le bouton pour participer à la roulette !**`)
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply();
        interaction.editReply({embeds:[debut],components: [ask]}).then(async msg => {
            let participants = ``;
            let tab = [];
            const filter = interraction => interraction.message.id == msg.id && !tab.some((element) => interraction.user.id === element.id);
            const collector = msg.channel.createMessageComponentCollector({
                filter,
                time: 20000
            });
            collector.on('collect', async collected => {
                collected.deferUpdate();
                switch (collected.customId) {
                    case 'Participe':
                        tab.push(collected.user);
                        participants += `${collected.user}\n`
                        const delai = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT_arrow:1065548690862899240> **${collected.user} participe !**\n\n**Participants** [${tab.length}]:\n${participants}`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({ embeds: [delai], components: [ask] });
                        break;
                };
            });
            collector.on("end", async collected => {
                if (tab.length >= 2) {
                    for (let i = 3;i > 0;i--) {
                        const attente = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT_arrow:1065548690862899240> Le tirage commence dans ${i}`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        msg.edit({ embeds: [attente], components: []});
                        await wait(1500);
                    };
                    prix = ["un pins","de l'amour","des amis","un trophée dédicacé","un billet pour Disney !","un bon d'achat de 10€ chez Jouetclub","le droit d'aller bosser","une télé 4K HD","100€ en pièces de 1 centimes","un yatch de luxe","le droit de booster le serveur","la gloire","un gage choisi par les participants","le droit de se taire","l'humiliation des participants","un mute","un kick","un ban","une voiture de sport toute options","une chirugie esthétique","le droit d'abandonner toutes forme de vie","une vie","un voyage aux maldives"];
                    const win = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT__fete:831817670822723597> Le gagnant est ${tab[Math.floor(Math.random() * tab.length)]} <a:LMT__fete:831817670822723597>\nIl gagne **${prix[Math.floor(Math.random() * prix.length)]}**`)
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({ embeds: [win], components: []});
                } else {
                    const fail = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> **Il faut être au moins 2 pour jouer !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[fail],components:[]})
                }
            });
        });
    }
}