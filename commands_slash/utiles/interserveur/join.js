const { EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const schedule = require('node-schedule');

module.exports = {
    async execute(interaction, db, date, client) {
        let channel = interaction.options.getChannel('channel');
        let code = interaction.options.getString('code');
        if (!channel) channel = interaction.channel;
        if (channel.type !== ChannelType.GuildText) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le salon doit être __textuel__ !**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true});
        }
        db.query('SELECT * FROM interserveur WHERE code = ?', code, (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) {
                const win = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Aucun code ne corresponds à celui que vous ayez donné !**\n\n> Vous n'aviez que 5 minutes ! :hourglass: `)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[win]})
            }
            if (res.guild_id_1 === interaction.member.guild.id) {
                const win = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu ne peux pas faire un interserveur dans le même serveur !**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[win]})
            }
            db.query('UPDATE interserveur SET guild_id_2 = ?, channel_id_2 = ?, code = ?', [interaction.member.guild.id, channel.id, null], (err) => {if (err) console.log(err);})
            const win = new EmbedBuilder()
                .setColor('#2F3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **La connexion est mise en place !**\n\n> Vos deux serveurs sont maintenant reliés entre eux.`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            interaction.reply({embeds:[win]});
        })
    }
}
