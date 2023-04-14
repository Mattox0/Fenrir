const {EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder} = require('discord.js');
let date = new Date()

module.exports = {
    name:'voc_left',
    description:'Left un voc',
    async execute(...params) {
        let oldMember = params[0];
        let db = params[2];
        db.query("SELECT * FROM servers WHERE guild_id = ?", oldMember.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) return;
            res = res[0];
            if (res.privateroom_category_id !== null) {
                let category = await oldMember.guild.channels.cache.find(x => x.id === res.privateroom_category_id);
                if (!category) return
                let channel = await oldMember.guild.channels.cache.find(x => x.id === oldMember.channelId);
                if (channel.parentId !== category.id || channel.id === res.privateroom_channel_id) return;
                if (channel.members.size === 0) {
                    db.query("DELETE FROM privateroom WHERE guild_id = ? AND user_id = ? AND channel_id = ?", [oldMember.guild.id, oldMember.id, channel.id], (err) => {if (err) console.log(err)});
                    channel.delete();
                }
            }
        })
    }
}