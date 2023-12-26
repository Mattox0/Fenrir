const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.query("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) return;
            res = res[0];
            if (res.prison_id !== null) {
                let channel = await interaction.member.guild.channels.cache.find(x => x.id === res.prison_id)
                if (channel) channel.delete();
                let role = await interaction.member.guild.roles.cache.find(x => x.id === res.prison_role_id);
                if (role) role.delete()
            }
            db.query("UPDATE servers SET prison_id = ?, prison_role_id = ?, prison_admin_id = ? WHERE guild_id = ?", [null, null, null, interaction.member.guild.id], (err) => {if (err) console.log(err)});
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le système de prison a été désactivé**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}