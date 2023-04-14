const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    async execute(interaction, date) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
            const notperms = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu n'a pas les permissions pour ajouté une emote !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms],ephemeral:true})
        }
        const fail = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Merci de respecter le format suivant**\n\n> /emote add NomDeTonEmote :emoji:')
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
        if (emote.startsWith('<:')) emoji = await interaction.member.guild.emojis.create({ attachment: `https://cdn.discordapp.com/emojis/${id}.png`, name: nom}).catch((err) => {console.log(err);return interaction.reply({embeds:[fail], ephemeral:true})});
        else emoji = await interaction.member.guild.emojis.create({ attachment: `https://cdn.discordapp.com/emojis/${id}.gif`, name: nom}).catch((err) => {console.log(err);return interaction.reply({embeds:[fail], ephemeral:true})});
        const win = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **L'emoji** ${emoji} **a bien été ajouté !**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win]})
    }
}