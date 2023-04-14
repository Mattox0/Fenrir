const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    name:'readybans',
    description:'Fetch les bannis',
    async execute(db,client) {
        db.query("SELECT * FROM bans", async (err, rows) => {
            if (err) return console.log(err);
            for (let res of rows) {
                console.log(res)
                let guild = await client.guilds.cache.get(res.guild_id);
                if (res.deban < new Date()) {
                    try {
                        const banList = await guild.bans.fetch();
                        let person = banList.find(user => user.id === res.user_id)
                        if (person) {
                            guild.members.unban(person.user);
                        }
                        db.query('DELETE FROM bans WHERE user_id = ?',res.user_id, (err) => {if (err) throw err });
                    } catch(e) {
                        console.log(e);
                    }
                    return
                }
                new schedule.scheduleJob(res.deban, async function() {
                    try {
                        const banList = await guild.guild.bans.fetch();
                        let person = banList.find(user => user.id === res.user_id)
                        if (person) {
                            guild.members.unban(person.user);
                        }
                        db.query('DELETE FROM bans WHERE user_id = ?',res.user_id, (err) => {if (err) throw err });
                    } catch(e) {
                        console.log(e)
                    }
                })
            }
        }) 
    }
}