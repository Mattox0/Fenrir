const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
            const notperms = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Tu n'as pas les permissions pour ajouter une emote !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms], ephemeral: true})
        }
        const fail = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`<a:LMT__arrow:831817537388937277> **Merci de spécifier un emoji du serveur**\n\n> /emote delete :emote:\n> /emote delete nomEmote`)
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        let emote = interaction.options.getString('emote')
        if (emote.startsWith('<:') || emote.startsWith('<a:')) {
            count=0
            let name = ""
            for (x of emote) {
                if (x === ':' || x === '>') {count++;continue}
                if (count != 1) continue
                name += x
            }
            emote = name
        }
        try {
            const emoji = await interaction.member.guild.emojis.cache.find(emoji => emoji.name === emote);
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('Oui')
                        .setLabel('Oui je suis sûre !')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('Non')
                        .setLabel('Finalement, non !')
                        .setStyle('DANGER')
                )
            const ask = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Est-tu sûre de vouloir supprimer l'emoji ${emoji} ?**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await interaction.deferReply();
            interaction.editReply({embeds:[ask],components:[row]}).then(msg => {
                const filter = interraction => interraction.user.id == interaction.member.id && interraction.message.id == msg.id;
                const collector = msg.channel.createMessageComponentCollector({
                    filter,
                    max: 1,
                    time: 60000
                });
                collector.on('end', collected => {
                    if (!collected.first()) {
                        const tard = new MessageEmbed()
                            .setColor('#2f3136')
                            .setDescription(`<a:LMT__arrow:831817537388937277> **Essaye de te décider avant qu'il neige !**`)
                            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                        return msg.edit({embeds:[tard],components:[]})
                    }
                    switch (collected.first().customId) {
                        case 'Oui':
                            emoji.delete()
                            const win = new MessageEmbed()
                                .setColor('#2f3136')
                                .setDescription(`<a:LMT__arrow:831817537388937277> **L'emote \`:${emoji.name}:\` a bien été supprimé !**`)
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({embeds:[win],components:[]})
                            break
                        case 'Non':
                            const no = new MessageEmbed()
                                .setColor('#2f3136')
                                .setDescription('<a:LMT__arrow:831817537388937277> **La commande a bien été annulé !**')
                                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            return msg.edit({embeds:[no],components:[]})
                    }
                })
            })
        } catch (e) {
            console.log(e);
            return interaction.reply({embeds:[fail], ephemeral: true});
        }
    }   
}