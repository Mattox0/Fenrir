const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.query('SELECT * FROM privateroom WHERE guild_id = ? AND channel_id = ?', [interaction.member.guild.id, interaction.member.voice.channelId], async (err, res) => {
            if (err) {return console.log(err);}
            if (res.length === 0) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Vous n\'etes pas dans un salon privé**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]})
            }
            let channel = await interaction.member.guild.channels.cache.find(x => x.id === interaction.member.voice.channelId);
            let permissions = channel.permissionsFor(interaction.member);
            if (permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                let private = interaction.options.getBoolean('private');
                if (private) {
                    channel.permissionOverwrites.edit(interaction.member.guild.id, {
                        ViewChannel : false,
                        Connect : false
                    })
                } else {
                    channel.permissionOverwrites.edit(interaction.member.guild.id, {
                        ViewChannel : true,
                        Connect : true
                    })
                }
                const win = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **${channel} est passé en ${private ? "privé" : "public"}**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[win]})
            } else {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Vous n\'avez pas les permissions !**\n\n> Ce n\'est pas votre salon\n> Demander au créateur de vous ajouter en tant que collaborateur\n\n> \`/vocal add <user>\`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]})
            }
        })
    }
}