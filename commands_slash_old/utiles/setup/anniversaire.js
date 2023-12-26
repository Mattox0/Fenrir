const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let channel = interaction.options.getChannel('channel');
        if (channel.type !== ChannelType.GuildText) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le salon doit être __textuel__**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true});
        };
        db.query("SELECT anniv_id, anniv_channel_id, anniv_role_id FROM servers",  async (err, rows) => {
            if (err) return console.log(err);
            for (let res of rows) {
                let role = await interaction.member.guild.roles.cache.find(role => role.id === res.anniv_role_id);
                if (!role) {
                    role = await interaction.member.guild.roles.create({
                        name: 'Joyeux anniversaire',
                        color: '#00fffd',
                        reason: 'N\'y touche pas ! J\'en ai besoin pour les anniversaires',
                    });
                };
                db.query("UPDATE servers SET anniv_id = ?, anniv_channel_id = ?, anniv_role_id = ? WHERE guild_id = ?", [true, channel.id, role.id, interaction.member.guild.id], (err) => {if (err) console.log(err)});
            };
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Le système d'anniversaire est maintenant actif !\n Les messages s'afficheront dans le salon** ${channel}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        });
    }
}