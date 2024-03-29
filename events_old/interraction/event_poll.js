const {EmbedBuilder} = require('discord.js')
let date = new Date()

module.exports = {
    name:'poll',
    description:'Check les entrées de poll',
    async execute(...params) {
        let interaction = params[0];
        let db = params[2];
        db.query("SELECT * FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?", [interaction.guildId, interaction.channelId, interaction.message.id], async (err, rows) => {
            if (err) return console.log(err);
            if (!rows) {
                interaction.reply({content:'Ce sondage est fini.', ephemeral: true})
            }
            for (let res of rows) {
                let userId = interaction.user.id
                let nb = interaction.customId.slice(4,5);
                for (let i = 1; i <= 9;i++) {
                    if (res[`numero_${i}_nb`] === null) break
                    let users = JSON.parse(res[`numero_${i}_nb`]);
                    if (users.includes(userId) && nb == i) {
                        continue;
                    } else if (users.includes(userId)) {
                        users = users.filter(item => item !== userId)
                        await db.promise().query(`UPDATE poll SET numero_${i}_nb = ? WHERE guild_id = ? AND channel_id = ? AND message_id = ?`, [JSON.stringify(users), interaction.guildId, interaction.channelId, interaction.message.id], (err) => {if (err) console.log(err)});
                    } else if (i == nb) {
                        let persons = JSON.parse(res[`numero_${nb}_nb`])
                        persons.push(userId);
                        await db.promise().query(`UPDATE poll SET numero_${nb}_nb = ? WHERE guild_id = ? AND channel_id = ? AND message_id = ?`, [JSON.stringify(persons),interaction.guildId, interaction.channelId, interaction.message.id], (err) => {if (err) console.log(err)})    
                    }
                }
                db.query("SELECT * FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?", [interaction.guildId, interaction.channelId, interaction.message.id], async (err, rows2) => {
                    if (err) return console.log(err);
                    if (!rows2) return;
                    for (let res2 of rows2) {
                        let description = `__${res2.question}__\n\n`;
                        let pourcent = "";
                        let allCount = 0
                        let numeros = ['<:LMT_one:901982492473573377>','<:LMT_two:901982559456608256>','<:LMT_three:901982617006657576>','<:LMT_four:901982648463917056>','<:LMT_five:901982703476441128>','<:LMT_six:901982741493604384>','<:LMT_seven:901982779489796106>','<:LMT_eight:901982810980630559>','<:LMT_nine:901982886662651936>']
                        for (let x = 1; x <= 9; x++) {
                            if (res2[`numero_${x}`] === null) break;
                            allCount += JSON.parse(res2[`numero_${x}_nb`]).length
                        }
                        for (let x = 0; x < 9; x++) {
                            if (res2[`numero_${x+1}`] === null) break
                            description += `${numeros[x]} <a:LMT_arrow:1065548690862899240> **${res2[`numero_${x+1}`]}**\n`;
                        }
                        for (let x = 0; x < 9; x++) {
                            if (res2[`numero_${x+1}`] === null) break
                            pourcent += `${numeros[x]} <a:LMT_arrow:1065548690862899240> **${Math.floor(JSON.parse(res2[`numero_${x+1}_nb`]).length / allCount * 100) / 100 * 100}% - ${JSON.parse(res2[`numero_${x+1}_nb`]).length}**\n`
                        }
                        const poll = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setDescription(`${description}\n[\`${allCount}\`] participants\n\n${pourcent}\nFin : <t:${Math.ceil(res2.dateFin / 1000)}:R>`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        await interaction.message.edit({embeds:[poll]});
                        await interaction.deferUpdate();
                    }
                })
            }
        })
    }
}