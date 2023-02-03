const {EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder} = require('discord.js');
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
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },{
                        id : oldMember.id,
                        allow : [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MOVE_MEMBERS, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageRoles]
                    }] 
                })
                user.voice.setChannel(voc);
                db.run("INSERT INTO privateroom (guild_id, user_id, channel_id) VALUES (?,?,?)", oldMember.guild.id, oldMember.id, voc.id, (err) => {if (err) console.log(err)});
            }
        })
    }
}