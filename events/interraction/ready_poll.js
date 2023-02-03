const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    name:'readypoll',
    description:'Fetch les polls',
    async execute(db,client) {
        db.each("SELECT * FROM poll", async (err, res) => {
            if (!res || err) {
                return console.log(err);
            }
            let guild = await client.guilds.cache.get(res.guild_id);
            if (res.dateFin < new Date()) {
                try {
                    let channel = await guild.channels.cache.find(x => x.id === res.channel_id);
                    if (!channel) return
                    let message = await channel.messages.fetch(res.message_id);
                    if (!message) {
                        return
                    }
                    message.edit({components:[]})
                    db.run('DELETE FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?',res.guild_id, res.channel_id, res.message_id, (err) => {if (err) throw err });
                } catch(e) {
                    console.log(e);
                }
                return
            }
            new schedule.scheduleJob(res.dateFin, async function() {
                try {
                    let channel = await guild.channels.cache.find(x => x.id === res.channel_id);
                    if (!channel) return
                    let message = await channel.messages.fetch(res.message_id);
                    if (!message) {
                        return
                    }
                    message.edit({components:[]})
                    db.run('DELETE FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?',res.guild_id, res.channel_id, res.message_id, (err) => {if (err) throw err });
                } catch(e) {
                    console.log(e);
                }
                return
            })
        }) 
    }
}