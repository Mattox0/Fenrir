const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let role = interaction.options.getRole('role');
        db.get("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            let chann;
            let prison;
            if (res.prison_id !== null) {
                chann = await interaction.member.guild.channels.cache.find(x => x.id === res.prison_id);
            }
            if (!chann) {
                chann = await interaction.member.guild.channels.create("tribunal", { 
                    type: "GUILD_TEXT",
                    position : 1,
                    permissionOverwrites: [{
                        id: interaction.member.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }] 
                });
                if (role) chann.permissionOverwrites.edit(role, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ManageMessages: true });
            }
            if (res.prison_role_id !== null) {
                prison = await interaction.member.guild.roles.cache.find(x => x.id === res.prison_role_id);
            }
            if (!prison) {
                prison = await interaction.member.guild.roles.create({
                    name: 'Prison',
                    color: '#000001',
                    reason: 'N\'y touche pas ! j\'en ai besoin pour la prison',
                });
            }
            interaction.member.guild.channels.cache.forEach(x => {
                if (x.id === chann.id) x.permissionOverwrites.edit(prison, { VIEW_CHANNEL:true});
                else x.permissionOverwrites.edit(prison, { VIEW_CHANNEL: false});
            })
            if (role) db.run("UPDATE servers SET prison_id = ?, prison_role_id = ?, prison_admin_id = ? WHERE guild_id = ?",chann.id,prison.id,role.id,interaction.member.guild.id, (err) => {if (err) console.log(err)});
            else db.run("UPDATE servers SET prison_id = ?, prison_role_id = ? WHERE guild_id = ?",chann.id,prison.id,interaction.member.guild.id, (err) => {if (err) console.log(err)});
            const win = new EmbedBuilder()
                .setColor("#2f3136")
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Le système de prison est activé !**\nLes prisonniers iront donc dans la prison ${chann}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}