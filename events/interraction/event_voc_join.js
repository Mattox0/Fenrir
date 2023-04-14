const {EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ChannelType} = require('discord.js');
let date = new Date()

module.exports = {
    name:'voc_join',
    description:'Join un voc',
    async execute(...params) {
        let oldMember = params[0];
        let db = params[2];
        db.query("SELECT * FROM servers WHERE guild_id = ?", oldMember.guild.id, async (err, rows) => {
            if (err) return console.log(err);
            if (rows.length === 0) return;
            let res = rows[0];
            if (res.privateroom_category_id !== null) {
                let category = await oldMember.guild.channels.cache.find(x => x.id === res.privateroom_category_id);
                if (!category) return
                if (oldMember.channelId !== res.privateroom_channel_id) return;
                let user = await oldMember.guild.members.cache.find(x => x.id === oldMember.id);
                let voc = await oldMember.guild.channels.create({ 
                    name: `Salon de ${user.user.username}`,
                    type: ChannelType.GuildVoice,
                    parent: category,
                    userLimit : 99,
                    permissionOverwrites: [{
                        id: oldMember.guild.id,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },{
                        id : oldMember.id,
                        allow : [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageRoles]
                    }] 
                })
                user.voice.setChannel(voc);
                db.query("INSERT INTO privateroom (guild_id, user_id, channel_id) VALUES (?,?,?)", [oldMember.guild.id, oldMember.id, voc.id], (err) => {if (err) console.log(err)});
            }
        })
    }
}