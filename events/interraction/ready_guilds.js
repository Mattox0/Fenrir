const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    name:'readyguilds',
    description:'Fetch les guilds',
    async execute(db,client) {
        let allGuild = await client.guilds.fetch();
        await allGuild.forEach(elem => {
            db.get("SELECT * FROM servers WHERE guild_id = ?", elem.id, (err, res) => {
                if (err) return console.log(err);
                if (!res) {
                    db.run("INSERT INTO servers (guild_id) VALUES (?)",elem.id, (err) => {if (err) console.log(err)})
                }
            })
        })
        allGuild = allGuild.map(elem => elem = elem.id)
        db.each("SELECT guild_id FROM servers", (err, res) => {
            if (err) return console.log(err);
            if (!allGuild.includes(res.guild_id)) {
                db.run("DELETE FROM servers WHERE guild_id = ?",res.guild_id, (err) => {if (err) console.log(err)});
            }
        })
    }
}