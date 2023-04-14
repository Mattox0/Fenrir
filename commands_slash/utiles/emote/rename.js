const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    async execute(interaction, date) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
            const notperms = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu n'as pas les permissions pour ajouter une emote !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[notperms], ephemeral: true})
        }
        const fail = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`<a:LMT_arrow:1065548690862899240> **Merci de spécifier un emoji du serveur**\n\n> /emote rename NouveauNom :emote:\n> /emote rename NouveauNom AncienNom`)
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        let nouveauNom = interaction.options.getString('nom');
        let emote = interaction.options.getString('emote');
        if (emote.startsWith('<:') || emote.startsWith('<a:')) {
            count = 0;
            nameEmote = "";
            for (x of emote) {
                if (x === ':' || x === '>') {count++;continue};
                if (count != 1) continue;
                nameEmote += x;
            }
            emote = nameEmote;
        }
        try {
            const emoji = await interaction.member.guild.emojis.cache.find(emoji => emoji.name === emote);
            if (!emoji) return interaction.reply({embeds:[fail], ephemeral:true});
            emoji.setName(nouveauNom);
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **L\'emote a bien été modifié ${emoji} **`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]})
        } catch (e) {
            console.log(e);
            return interaction.reply({embeds:[fail], ephemeral:true});
        }
    }
}