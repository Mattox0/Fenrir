const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.query("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) return;
            res = res[0];
            if (res.ticket_id !== null) {
                let chann1 = await interaction.member.guild.channels.cache.find(x => x.id === res.ticket_id);
                let channels = await interaction.member.guild.channels.cache.filter(x => x.parentId === res.ticket_id);
                if (chann1) {
                    for (const [_, channel] of channels) {
                        channel.delete()
                    }
                    chann1.delete();
                }
            }
            db.query("UPDATE servers SET ticket_id = ? WHERE guild_id = ?", [null,  interaction.member.guild.id], (err) => {if (err) return console.log(err)});
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le système de ticket a été désactivé**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}