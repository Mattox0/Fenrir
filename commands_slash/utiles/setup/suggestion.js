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
        db.run('UPDATE servers SET suggestion_id = ? WHERE guild_id = ?',channel.id, interaction.member.guild.id, (err) => {if (err) throw err})
        const win = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Le système de suggestion est maintenant actif dans le salon** ${channel}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win]});
    }
}