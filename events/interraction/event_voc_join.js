const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');
let date = new Date()

module.exports = {
    name:'voc_join',
    description:'Join un voc',
    async execute(...params) {
        let oldMember = params[0];
        let db = params[2];
        db.get("SELECT * FROM servers WHERE guild_id = ?", oldMember.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) return
            if (res.privateroom_category_id !== null) {
                let category = await oldMember.guild.channels.cache.find(x => x.id === res.privateroom_category_id);
                if (!category) return
                if (oldMember.channelId !== res.privateroom_channel_id) return;
                let user = await oldMember.guild.members.cache.find(x => x.id === oldMember.id);
                let voc = await oldMember.guild.channels.create(`Salon de ${user.user.username}`, { 
                    type: "GUILD_VOICE",
                    parent: category,
                    userLimit : 99,
                    permissionOverwrites: [{
                        id: oldMember.guild.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL]
                    },{
                        id : oldMember.id,
                        allow : [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MOVE_MEMBERS, Permissions.FLAGS.CONNECT, Permissions.FLAGS.CREATE_INSTANT_INVITE, Permissions.FLAGS.MANAGE_ROLES]
                    }] 
                })
                user.voice.setChannel(voc);
                db.run("INSERT INTO privateroom (guild_id, user_id, channel_id) VALUES (?,?,?)", oldMember.guild.id, oldMember.id, voc.id, (err) => {if (err) console.log(err)});
            }
        })
    }
}