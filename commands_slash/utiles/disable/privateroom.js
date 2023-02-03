const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.get("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) return;
            if (res.privateroom_category_id !== null) {
                let category = await interaction.member.guild.channels.cache.find(x => x.id === res.privateroom_category_id);
                let channels = await interaction.member.guild.channels.cache.filter(x => x.parentId === res.privateroom_category_id);
                if (category) {
                    for (const [channelId, channel] of channels) {
                        channel.delete()
                    }
                    category.delete();
                }
            }
            db.run("UPDATE servers SET privateroom_category_id = ?, privateroom_channel_id = ? WHERE guild_id = ?",null, null, interaction.member.guild.id, (err) => {if (err) console.log(err)});
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le système de vocaux privées a été désactivé**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}