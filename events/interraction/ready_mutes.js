const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    name:'readymutes',
    description:'Fetch les mutes',
    async execute(db,client) {
        db.each("SELECT * FROM mute INNER JOIN servers ON mute.guild_id = servers.guild_id", async (err, res) => {
            if (!res || err) {
                return console.log(err);
            }
            let guild = await client.guilds.cache.get(res.guild_id);
            if (res.end_date < new Date()) {
                try {
                    let mute = await guild.roles.cache.find(x => x.id === res.mute_id);
                    let person = await guild.members.cache.find(user => user.id === res.user_id);
                    if (person && mute) {
                        person.roles.remove(mute);
                    }
                    db.run('DELETE FROM mute WHERE id = ?',res.id, (err) => {if (err) throw err });
                } catch(e) {
                    console.log(e);
                }
                return
            }
            new schedule.scheduleJob(res.end_date, async function() {
                try {
                    let mute = await guild.roles.cache.find(x => x.id === res.mute_id);
                    let person = await guild.members.cache.find(user => user.id === res.user_id);
                    if (person && mute) {
                        person.roles.remove(mute);
                    }
                    db.run('DELETE FROM mute WHERE id = ?',res.id, (err) => {if (err) throw err });
                } catch(e) {
                    console.log(e)
                }
            })
        }) 
    }
}