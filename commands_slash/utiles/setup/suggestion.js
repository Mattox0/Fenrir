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
        db.run('UPDATE servers SET suggestion_id = ? WHERE guild_id = ?',channel.id, interaction.member.guild.id, (err) => {if (err) throw err})
        const win = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Le système de suggestion est maintenant actif\ndans le salon** ${channel}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win]});
    }
}