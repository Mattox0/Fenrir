const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    name:'readyguilds',
    description:'Fetch les guilds',
    async execute(db,client) {
        let allGuild = await client.guilds.fetch();
        await allGuild.forEach(elem => {
            db.query("SELECT * FROM servers WHERE guild_id = ?", elem.id, (err, res) => {
                if (err) return console.log(err);
                if (!res) {
                    db.query("INSERT INTO servers (guild_id) VALUES (?)",elem.id, (err) => {if (err) console.log(err)})
                }
            })
        })
        allGuild = allGuild.map(elem => elem = elem.id)
        db.query("SELECT guild_id FROM servers", (err, rows) => {
            if (err) return console.log(err);
            for (let res of rows) {
                if (!allGuild.includes(res.guild_id)) {
                    db.query("DELETE FROM servers WHERE guild_id = ?",res.guild_id, (err) => {if (err) console.log(err)});
                }
            }
        })
    }
}