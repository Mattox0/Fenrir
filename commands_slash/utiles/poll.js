const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
const schedule = require("node-schedule")
let dateFin = new Date();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Crée un sondage avec vos choix !')
        .addStringOption(option => 
            option
            .setName('duration')
            .setDescription('Combien de temps voulez vous que votre sondage dure ?')
            .setRequired(true)
            .addChoices({ name: 'Infini', value: "infinite" })
            .addChoices({ name: '10 minutes', value: "10m" })
            .addChoices({ name: '30 minutes', value: "30m" })
            .addChoices({ name: '1 heure', value: "1h" })
            .addChoices({ name: '3 heure', value: "3h" })
            .addChoices({ name: '10 heure', value: "10h" })
            .addChoices({ name: '1 jour', value: "1j" })
            .addChoices({ name: '1 semaine', value: "1s" })
            .addChoices({ name: '1 mois', value: "1m" }))
        .addStringOption(option => option.setName('question').setDescription('Choissisez votre question').setRequired(true))
        .addStringOption(option => option.setName('poll1').setDescription('1er choix').setRequired(true))
        .addStringOption(option => option.setName('poll2').setDescription('2eme choix').setRequired(true))
        .addStringOption(option => option.setName('poll3').setDescription('3eme choix').setRequired(false))
        .addStringOption(option => option.setName('poll4').setDescription('4eme choix').setRequired(false))
        .addStringOption(option => option.setName('poll5').setDescription('5eme choix').setRequired(false))
        .addStringOption(option => option.setName('poll6').setDescription('6eme choix').setRequired(false))
        .addStringOption(option => option.setName('poll7').setDescription('7eme choix').setRequired(false))
        .addStringOption(option => option.setName('poll8').setDescription('8eme choix').setRequired(false))
        .addStringOption(option => option.setName('poll9').setDescription('9eme choix').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        let client = params[1];
        tab = [];
        let question = interaction.options.getString(`question`);
        for (let i = 1; i < 10; i++) {
            let poll = interaction.options.getString(`poll${i}`);
            if (poll) tab.push(poll);
        };
        let description = `__${question}__\n\n`;
        let pourcent = "";
        let numeros = ['<:LMT_one:901982492473573377>','<:LMT_two:901982559456608256>','<:LMT_three:901982617006657576>','<:LMT_four:901982648463917056>','<:LMT_five:901982703476441128>','<:LMT_six:901982741493604384>','<:LMT_seven:901982779489796106>','<:LMT_eight:901982810980630559>','<:LMT_nine:901982886662651936>']
        for (let x = 0; x < tab.length; x++) {
            description += `${numeros[x]} <a:LMT_arrow:1065548690862899240> **${tab[x]}**\n`;
        }
        for (let x = 0; x < tab.length; x++) {
            pourcent += `${numeros[x]} <a:LMT_arrow:1065548690862899240> **0%**\n`
        }
        const row1 = new ActionRowBuilder();
        const row2 = new ActionRowBuilder();
        const row3 = new ActionRowBuilder();
        let i = 1;
        tab.forEach(() => {
            if (i <= 3) {
                row1.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`poll${i}`)
                        .setEmoji(`${numeros[i-1]}`)
                        .setStyle(ButtonStyle.Success)
                )
            } else if (i <= 6) {
                row2.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`poll${i}`)
                        .setEmoji(`${numeros[i-1]}`)
                        .setStyle(ButtonStyle.Success)
                )
            } else {
                row3.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`poll${i}`)
                        .setEmoji(`${numeros[i-1]}`)
                        .setStyle(ButtonStyle.Success)
                )
            };
            i++;
        })
        let duration = interaction.options.getString('duration')
        let dateFin = new Date();
        if (duration === "10m") dateFin.setMinutes(dateFin.getMinutes() + 10)
        else if (duration === "30m") dateFin.setMinutes(dateFin.getMinutes() + 30)
        else if (duration === "1h") dateFin.setHours(dateFin.getHours() + 1)
        else if (duration === "3h") dateFin.setHours(dateFin.getHours() + 3)
        else if (duration === "10h") dateFin.setHours(dateFin.getHours() + 10)
        else if (duration === "1j") dateFin.setDate(dateFin.getDate() + 1)
        else if (duration === "1s") dateFin.setDate(dateFin.getDate() + 7)
        else if (duration === "1m") dateFin.setDate(dateFin.getDate() + 30)
        await interaction.deferReply()
        let message
        const poll = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(description)
            .setDescription(`[\`0\`] participants\n\n${pourcent}\n${duration !== "infinite" ? `Fin : <t:${Math.ceil(dateFin / 1000)}:R>` : "" }`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (i <= 4) message = await interaction.editReply({ embeds : [poll], components : [row1]});
        else if (i <= 7)  message = await interaction.editReply({ embeds : [poll], components : [row1,row2]});
        else message = await interaction.editReply({ embeds : [poll], components : [row1,row2,row3] });
        if (duration !== "infinite") {
            db.run('INSERT INTO poll (guild_id, channel_id, message_id, numero_1, numero_1_nb, numero_2, numero_2_nb, numero_3, numero_3_nb, numero_4, numero_4_nb, numero_5, numero_5_nb, numero_6, numero_6_nb, numero_7, numero_7_nb, numero_8, numero_8_nb, numero_9, numero_9_nb, dateFin, question) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', message.guildId, message.channelId, message.id, interaction.options.getString('poll1'), JSON.stringify([]), interaction.options.getString('poll2'), JSON.stringify([]), interaction.options.getString('poll3') ? interaction.options.getString('poll3') : null, interaction.options.getString('poll3') ? JSON.stringify([]) : null,interaction.options.getString('poll4') ? interaction.options.getString('poll4') : null, interaction.options.getString('poll4') ? JSON.stringify([]) : null, interaction.options.getString('poll5') ? interaction.options.getString('poll5') : null, interaction.options.getString('poll5') ? JSON.stringify([]) : null, interaction.options.getString('poll6') ? interaction.options.getString('poll6') : null, interaction.options.getString('poll6') ? JSON.stringify([]) : null,interaction.options.getString('poll7') ? interaction.options.getString('poll7') : null, interaction.options.getString('poll7') ? JSON.stringify([]) : null, interaction.options.getString('poll8') ? interaction.options.getString('poll8') : null, interaction.options.getString('poll8') ? JSON.stringify([]) : null, interaction.options.getString('poll9') ? interaction.options.getString('poll9') : null, interaction.options.getString('poll9') ? JSON.stringify([]) : null, dateFin, interaction.options.getString('question'), (err) => {if (err) console.log(err)});
            new schedule.scheduleJob(dateFin, async function() {
                db.get('SELECT * FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?', message.guildId, message.channelId, message.id, async (err, res) => {
                    if (err) return console.log(err);
                    if (!res) return
                    db.run('DELETE FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?', res.guild_id, res.channel_id, res.message_id, (err) => {if (err) console.log(err)});
                    let guild = client.guilds.cache.get(res.guild_id);
                    let channel
                    if (guild) channel = guild.channels.cache.find(x => x.id === res.channel_id)
                    if (channel) message = await channel.messages.fetch(res.message_id)
                    message.edit({components:[]})
                })
            })
        }
    }
}