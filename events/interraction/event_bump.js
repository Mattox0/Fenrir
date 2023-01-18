const { MessageEmbed } = require('discord.js')

module.exports = {
    name:'event_bump',
    description:'Ajoute au tableau de bumps',
    async execute(...params) {
        let message = params[0];
        let date = new Date()
        let db = params[3];
        db.get('SELECT bumps_id FROM servers WHERE guild_id = ?',message.member.guild.id, (err,res) => { 
            if (err) return console.log(err)
            if (!res) return
            if (res.bumps_id === '1') {
                db.get('SELECT * FROM bumps WHERE user_id = ? AND guild_id = ?',message.member.id,message.guild.id, (err, res) => {
                    if (err) return console.error(err);
                    if (!res) {
                        db.run('INSERT INTO bumps (user_id, last_bump,count_bumps, guild_id) VALUES (?, ?, ?, ?)',message.member.id,Math.floor(+ date / 1000),1,message.guild.id, (err) => {if (err) console.log(err)})
                    } else {
                        lastBump = new Date(res.last_bump * 1000)
                        if (Math.floor((date - lastBump)/1000/60/60) < 2) {
                            return
                        }
                        db.run('UPDATE bumps SET count_bumps = ?, last_bump = ? WHERE user_id = ? AND guild_id = ?',res.count_bumps+1,Math.floor(+ date / 1000),res.user_id,message.guild.id, (err) => { if (err) console.log(err)})
                    }
                })
            }
        })
        
    }
}