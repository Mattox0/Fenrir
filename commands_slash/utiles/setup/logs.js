const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let chann = interaction.options.getChannel('channel');
        if (chann.type !== ChannelType.GuildText) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le salon doit être __textuel__**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true});
        };
        let channelCreate = interaction.options.getBoolean('createchannel') === false ? false : true;
        let channelDelete = interaction.options.getBoolean('deletechannel') === false ? false : true;
        let channelUpdate = interaction.options.getBoolean('updatechannel') === false ? false : true;
        let messageDelete = interaction.options.getBoolean('messagedelete') === false ? false : true;
        let messageUpdate = interaction.options.getBoolean('messageupdate') === false ? false : true;
        let roleCreate = interaction.options.getBoolean('rolecreate') === false ? false : true;
        let roleDelete = interaction.options.getBoolean('roledelete') === false ? false : true;
        let roleUpdate = interaction.options.getBoolean('roleupdate') === false ? false : true;
        let emojiCreate = interaction.options.getBoolean('emojicreate') === false ? false : true;
        let emojiDelete = interaction.options.getBoolean('emojidelete') === false ? false : true;
        let emojiUpdate = interaction.options.getBoolean('emojiupdate') === false ? false : true;
        let voiceStateUpdate = interaction.options.getBoolean('voiceupdate') === false ? false : true;
        let guildMemberUpdate = interaction.options.getBoolean('userupdate') === false ? false : true;
        let guildMemberAdd = interaction.options.getBoolean('userjoin') === false ? false : true;
        let guildMemberRemove = interaction.options.getBoolean('userleft') === false ? false : true;
        let guildBanAdd = interaction.options.getBoolean('userban') === false ? false : true;
        let guildBanRemove = interaction.options.getBoolean('userunban') === false ? false : true;
        let inviteCreate = interaction.options.getBoolean('invite') === false ? false : true;
        let inviteDelete = inviteCreate
        let stickerCreate = interaction.options.getBoolean('sticker') === false ? false : true;
        let stickerDelete = stickerCreate
        let threadCreate = interaction.options.getBoolean('thread') === false ? false : true;
        let threadDelete = threadCreate

        db.promise().query('UPDATE servers SET logs_id = ? WHERE guild_id = ?', [chann.id, interaction.member.guild.id], (err) => {if (err) console.log(err)});
        db.query("SELECT * FROM logs WHERE guild_id = ?", interaction.member.guild.id, (err, res) => {
            if (err) {return console.log(err)}
            if (res.length === 0) {
                db.query("INSERT INTO logs (guild_id, logs_id,channelCreate,channelDelete,channelUpdate,messageDelete,messageUpdate,roleCreate,roleDelete,roleUpdate,emojiCreate,emojiDelete,emojiUpdate,voiceStateUpdate,guildMemberUpdate,guildMemberRemove,guildBanAdd,guildBanRemove,inviteCreate,inviteDelete,guildMemberAdd,stickerCreate,stickerDelete,threadCreate,threadDelete) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [interaction.member.guild.id,chann.id,channelCreate,channelDelete,channelUpdate,messageDelete,messageUpdate,roleCreate,roleDelete,roleUpdate,emojiCreate,emojiDelete,emojiUpdate,voiceStateUpdate,guildMemberUpdate,guildMemberRemove,guildBanAdd,guildBanRemove,inviteCreate,inviteDelete,guildMemberAdd,stickerCreate,stickerDelete,threadCreate,threadDelete], (err, res) => {if (err) console.log(err)});
            } else {
                db.query("UPDATE logs SET logs_id = ?,channelCreate = ?,channelDelete = ?,channelUpdate = ?,messageDelete = ?,messageUpdate = ?,roleCreate = ?,roleDelete = ?,roleUpdate = ?,emojiCreate = ?,emojiDelete = ?,emojiUpdate = ?,voiceStateUpdate = ?,guildMemberUpdate = ?,guildMemberRemove = ?,guildBanAdd = ?,guildBanRemove = ?,inviteCreate = ?,inviteDelete = ?,guildMemberAdd = ?,stickerCreate = ?,stickerDelete = ?,threadCreate = ?,threadDelete = ? WHERE guild_id = ?", [chann.id,channelCreate,channelDelete,channelUpdate,messageDelete,messageUpdate,roleCreate,roleDelete,roleUpdate,emojiCreate,emojiDelete,emojiUpdate,voiceStateUpdate,guildMemberUpdate,guildMemberRemove,guildBanAdd,guildBanRemove,inviteCreate,inviteDelete,guildMemberAdd,stickerCreate,stickerDelete,threadCreate,threadDelete, interaction.member.guild.id], (err, res) => {if (err) console.log(err)});
            }
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Le système de logs est maintenant actif\ndans le salon** ${chann}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}