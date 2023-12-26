const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    name:'readypoll',
    description:'Fetch les polls',
    async execute(db,client) {
        db.query("SELECT * FROM poll", async (err, rows) => {
            if (err) {
                return console.log(err);
            }
            for (let res of rows) {
                let guild = await client.guilds.cache.get(res.guild_id);
                if (res.dateFin < new Date()) {
                    try {
                        let channel = await guild.channels.cache.find(x => x.id === res.channel_id);
                        if (!channel) continue
                        let message = await channel.messages.fetch(res.message_id);
                        if (!message) continue
                        message.edit({components:[]})
                        db.query('DELETE FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?', [res.guild_id, res.channel_id, res.message_id], (err) => {if (err) throw err });
                    } catch(e) {
                        console.log(e);
                    }
                } else {
                    new schedule.scheduleJob(res.dateFin, async function() {
                        try {
                            console.log("READY_POLL -> Poll en cours QUI EST terminé !")
                            let channel = await guild.channels.cache.find(x => x.id === res.channel_id);
                            if (!channel) throw new Error("Channel introuvable");
                            let message = await channel.messages.fetch(res.message_id);
                            if (!message) throw new Error("Message introuvable");
                            message.edit({components:[]});
                            db.query('DELETE FROM poll WHERE guild_id = ? AND channel_id = ? AND message_id = ?', [res.guild_id, res.channel_id, res.message_id], (err) => {if (err) throw err });
                        } catch(e) {
                            console.log(e);
                        }
                    })
                }
            }
        }) 
    }
}