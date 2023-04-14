const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.query("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) return;
            res = res[0];
            if (res.stats_id !== null) {
                let chann1 = await interaction.member.guild.channels.cache.find(x => x.id === res.stats_id);
                if (chann1) chann1.delete();
                let chann2 = await interaction.member.guild.channels.cache.find(x => x.id === res.stats_online_id);
                if (chann2) chann2.delete();
                let chann3 = await interaction.member.guild.channels.cache.find(x => x.id === res.stats_bot_id);
                if (chann3) chann3.delete();
            }
            db.query("UPDATE servers SET stats_id = ?, stats_online_id = ?, stats_bot_id = ?, stats_message = ?, stats_bot_message = ?, stats_online_message = ? WHERE guild_id = ?", [null, null, null, null, null, null, interaction.member.guild.id], (err) => {if (err) console.log(err)});
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le système de stats a été désactivé**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}