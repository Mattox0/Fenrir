const { MessageEmbed } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.get("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.anniv_id === 0 || res.anniv_id === null)  {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Le système d\'anniversaire n\'est pas débloqué dans votre serveur**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]});
            }
            let role = await interaction.member.guild.roles.cache.find(x => x.id === res.anniv_role_id);
            if (role) role.delete();
            db.run("UPDATE servers SET anniv_id = ?, anniv_channel_id = ?, anniv_role_id = ? WHERE guild_id = ?", false, null, null, interaction.member.guild.id, (err) => {if (err) console.log(err)});
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Le système d\'anniversaire a été désactivé**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}