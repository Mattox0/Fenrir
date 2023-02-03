const {EmbedBuilder} = require('discord.js');

module.exports = {
    async execute(...params) {
        let interaction = params[0];
        let date = params[1];
        let emote = interaction.options.getString('emote');
        let nameE = ""
        let id = ""
        if (emote.startsWith('<:') || emote.startsWith('<a:')) {
            count=0
            for (x of emote) {
                if (x === ':' || x === '>') {count++;continue}
                if (count === 1) {nameE += x;continue}
                if (count === 2) {id += x;continue}
            }
        }
        const emoji = await interaction.member.guild.emojis.cache.find(emoji => emoji.name === nameE);
        if (!emoji) {
            console.log("coucou")
            if (emote.startsWith('<:')) link = `https://cdn.discordapp.com/emojis/${id}.png`
            if (emote.startsWith('<a:')) link = `https://cdn.discordapp.com/emojis/${id}.gif`
            else {
                const fail = new EmbedBuilder()
                .setColor('2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Merci de respecter le format suivant :**\n\n> \`/emote image :emote:\`\n> \`/emote image nomEmote\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            const emoteEmbed = new EmbedBuilder()
                .setColor('#2f3136')
                .setImage(link)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[emoteEmbed]})
        }
        link = emoji.url
        emoji.animated ? aperçu = `<a:${emoji.name}:${emoji.id}>` : aperçu = `<:${emoji.name}:${emoji.id}>`
        const emote1 = new EmbedBuilder()
        .setColor('#2f3136')
        .setImage(link)
        .setDescription(`**Nom: \`${emoji.name}\`\nAperçu: ${aperçu}\nIdentifiant: \`${emoji.id}\`\nIdentifier: \`${aperçu.slice(1,-1)}\`\nImage:**`)
        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[emote1]})
    }
}