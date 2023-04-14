const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    async execute(client, db) {
        db.query("SELECT guild_id, stats_id, stats_bot_id, stats_online_id, stats_message, stats_bot_message, stats_online_message FROM servers", async (err, rows) => {
            if (err) {return console.log("Event stats -> ", err)}
            for (let res of rows) {
                let guild = await client.guilds.cache.get(res.guild_id);
                let allMembers = await guild.channels.cache.find(x => x.id === res.stats_id);
                if (allMembers) {
                    let nb = guild.memberCount;
                    allMembers.setName(res.stats_message.replace('{nb}',nb))
                }
                if (res.stats_bot_id !== null) {
                    let nbBot = guild.channels.cache.find(x => x.id === res.stats_bot_id);
                    if (nbBot) {
                        let nb = await guild.members.cache.filter(x => x.user.bot).size;
                        nbBot.setName(res.stats_bot_message.replace('{nb}',nb))
                    }
                }
                if (res.stats_online_id !== null) {
                    let nbOnline = guild.channels.cache.find(x => x.id === res.stats_online_id)
                    if (nbOnline) {
                        let guildWithPresence = await guild.members.fetch({withPresences : true});
                        let onlines = guildWithPresence.filter((online) => online.presence?.status === "online" || online.presence?.status === "idle" || online.presence?.status === "dnd").size;
                        nbOnline.setName(res.stats_online_message.replace('{nb}',onlines))
                    }
                }
            }
        })
    }
}