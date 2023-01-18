const {MessageEmbed} = require('discord.js')

module.exports = {
    name:'interserveur',
    description:'Check les interserveur',
    execute(...params) {
        let message = params[0];
        let args = params[1];
        let date  = params[2];
        let db  = params[3];
        let client = params[4];
        if (message.author.bot) return
        let guild = message.member.guild;
        let channel = message.channel;
        db.get("SELECT * FROM interserveur WHERE guild_id_1 = ? AND channel_id_1 = ? OR guild_id_2 = ? AND channel_id_2 = ?", guild.id, channel.id, guild.id, channel.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) return;
            if (!res.guild_id_2) return;
            if (res.guild_id_1 === guild.id && res.channel_id_1 === channel.id) {
                let guild2 = await client.guilds.cache.get(res.guild_id_2);
                let channel2 = await guild2.channels.cache.find(x => x.id === res.channel_id_2);
                if (guild2 && channel2 && args.join(" ") !== '') {
                    channel2.send({content:`\`${message.author.username}\` : **${args.join(' ')}**`});
                }
            } else {
                let guild1 = await client.guilds.cache.get(res.guild_id_1);
                let channel1 = await guild1.channels.cache.find(x => x.id === res.channel_id_1);
                if (guild1 && channel1 && args.join(" ") !== '') {
                    channel1.send({content:`\`${message.author.username}\` : **${args.join(' ')}**`})
                }
            }
        })
    }
}