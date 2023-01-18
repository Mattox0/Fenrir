const { MessageEmbed } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.get("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) return;
            if (res.ticket_id !== null) {
                let chann1 = await interaction.member.guild.channels.cache.find(x => x.id === res.ticket_id);
                let channels = await interaction.member.guild.channels.cache.filter(x => x.parentId === res.ticket_id);
                if (chann1) {
                    for (const [channelId, channel] of channels) {
                        channel.delete()
                    }
                    chann1.delete();
                }
            }
            db.run("UPDATE servers SET ticket_id = ? WHERE guild_id = ?", null,  interaction.member.guild.id, (err) => {if (err) console.log(err)});
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Le système de ticket a été désactivé**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}