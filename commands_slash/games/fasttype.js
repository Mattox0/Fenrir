const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const wait = require('util').promisify(setTimeout);
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fasttype')
        .setDescription('Lance une partie de fasttype en groupe ou en solo'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Oui')
                    .setLabel('Je suis prêt')
                    .setStyle(ButtonStyle.Success)
            )
        const start = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Appuyez sur le boutton quand vous êtes prêt !**')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.deferReply();
        interaction.editReply({embeds:[start], components:[row]}).then(msg => {
        const filter = interaction => interaction.message.id === msg.id
        const collector = msg.channel.createMessageComponentCollector({filter, max:1, time:60000})
        collector.on('end', async collected => {
            if (!collected.first()) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Décidez vous avant Noël !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return msg.edit({embeds:[fail],components:[]});
            }
            let mots = fs.readFileSync('./commands_slash/games/fasttype_words.txt','utf8')
            const sentence = mots.split('\n').map(x => x.replace('\r',''))[Math.floor(Math.random() * mots.split('\n').length)];
            const game = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('Tu es prêt ? Début dans : `5`')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            msg.edit({embeds:[game],components:[]});
            await wait(1000);
            for (let i = 4; i > 0; i--) {
                const game = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`Tu es prêt ? Début dans : \`${i}\` secondes`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                msg.edit({embeds:[game],components:[]});
                await wait(1000);
            }
            const realGame = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Recopies cette phrase le plus vite possible :**\n\n> \`${sentence}\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            msg.edit({embeds:[realGame],components:[]});
            let win;
            const filter1 = interaction => interaction.channel.id === msg.channel.id
            const collector1 = msg.channel.createMessageCollector({filter1, time:120000})
            let dateStart = new Date();
            collector1.on('collect', collected => {
                if (collected.content.toLowerCase() === sentence.toLowerCase()) {
                    win = collected
                    collector1.stop()
                } else {
                    collected.react('❌')
                }
            })
            collector1.on('end', collected => {
                if (!collected.first() || !win) {
                    const embed = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> **Le jeu est annulé**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return msg.edit({embeds:[embed],components:[]})
                }
                let dateEnd = new Date()
                let seconds = (dateEnd - dateStart) / 1000
                const vic = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **<@${win.author.id}> est trop rapide !**\n\n> Ta vitesse de frappe est de **${Math.round(sentence.length / 5 / seconds * 60 * 100) / 100}**\n\n> \`La vitesse de frappe depend du temps et de la taille de la phrase.\``)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return msg.reply({embeds:[vic],components:[]})
            })
        })
        })
    }
}