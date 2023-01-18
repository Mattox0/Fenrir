const { MessageEmbed } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let channel = interaction.options.getChannel('channel');
        if (channel.type !== 'GUILD_TEXT') {
            const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Le salon doit être __textuel__**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true});
        };
        db.get("SELECT anniv_id, anniv_channel_id, anniv_role_id FROM servers",  async (err, res) => {
            let role = await interaction.member.guild.roles.cache.find(role => role.id === res.anniv_role_id);
            if (!role) {
                role = await interaction.member.guild.roles.create({
                    name: 'Joyeux anniversaire',
                    color: '#00fffd',
                    reason: 'N\'y touche pas ! j\'en ai besoin pour les anniversaires',
                });
            }
            db.run("UPDATE servers SET anniv_id = ?, anniv_channel_id = ?, anniv_role_id = ? WHERE guild_id = ?",true, channel.id, role.id, interaction.member.guild.id, (err) => {if (err) console.log(err)});
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Le système d'anniversaire est maintenant actif !\n Les messages s'afficheront dans le salon** ${channel}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]});
        })
    }
}