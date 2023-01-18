const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    async execute(interaction, date) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
            const notperms = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Tu n'a pas les permissions pour ajouté une emote !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms],ephemeral:true})
        }
        const fail = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Merci de respecter le format suivant**\n\n> /emote add NomDeTonEmote :emoji:')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        let emote = interaction.options.getString('emote');
        let nom = interaction.options.getString('nom');
        nom = nom.replaceAll(' ','');
        if (!emote.startsWith('<:') && !emote.startsWith('<a:')) return interaction.reply({embeds:[fail], ephemeral:true})
        let count=0
        id = ""
        for (x of emote) {
            if (x === ':' || x === '>') {count++;continue}
            if (count != 2) continue
            id += x
        }
        if (emote.startsWith('<:')) emoji = await interaction.member.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.png`, nom).catch((err) => {console.log(err);return interaction.reply({embeds:[fail], ephemeral:true})});
        else emoji = await interaction.member.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.gif`, nom).catch((err) => {console.log(err);return interaction.reply({embeds:[fail], ephemeral:true})});
        const win = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **L'emoji** ${emoji} **a bien été ajouté !**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win]})
    }
}