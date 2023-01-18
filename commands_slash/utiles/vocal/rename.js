const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.get('SELECT * FROM privateroom WHERE guild_id = ? AND channel_id = ?', interaction.member.guild.id, interaction.member.voice.channelId, async (err, res) => {
            if (err) {return console.log(err);}
            if (!res) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Vous n\'etes pas dans un salon privé**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]})
            }
            let channel = await interaction.member.guild.channels.cache.find(x => x.id === interaction.member.voice.channelId);
            let permissions = channel.permissionsFor(interaction.member);
            if (permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
                let name = interaction.options.getString('name');
                channel.setName(name);
                const win = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **${channel} a été renommé.**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[win]});
            } else {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Vous n\'avez pas les permissions !**\n\n> Ce n\'est pas votre salon\n> Demander au créateur de vous ajouter en tant que collaborateur\n\n> \`/vocal add <user>\`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail]});
            }
        })
    }
}