const schedule = require('node-schedule');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name:'readyremindme',
    description:'Refresh les remindme',
    async execute(...params) {
        let db = params[0];
        let client = params[1];
        db.query('SELECT * FROM remindme', async (err, rows) => {
            if (err) {
                return console.log(err);
            }
            try {
                for (let result of rows) {
                    let guild = await client.guilds.cache.get(result.guild_id);
                    let person = await guild.members.cache.find(member => member.id === result.user_id);
                    if (result.dateFin < new Date()) {
                        person.send(`**Tu avais demandé un rappel** : ${result.raison}\n\`avec du retard, j'étais entrain de dormir\` :zzz:`);
                        db.query('DELETE FROM remindme WHERE message_id = ?',result.message_id, (err) => {if (err) console.log(err) });
                    } else {
                        new schedule.scheduleJob(result.dateFin, function() {
                            try {
                                person.send(`**Rappel** : ${result.raison}`)
                            } catch (err) {
                                console.log(err);
                            }
                            db.query('DELETE FROM remindme WHERE message_id = ?',result.message_id, (err) => {if (err) console.log(err) })
                        })
                    }
                }
            } catch(e) {
                console.log(e)
                db.query('DELETE FROM remindme WHERE message_id = ?',result.message_id, (err) => {if (err) console.log(err) })
            }
        })
    }
}