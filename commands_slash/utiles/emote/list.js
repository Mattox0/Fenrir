const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date) {
        const emojis = interaction.member.guild.emojis.cache
        let pages = [];
        let phrase = ""
        emojis.forEach(emoji => {
            if (phrase.length > 1500) {pages.push(phrase);phrase = ""}
            if (emoji.animated) phrase += `<a:${emoji.name}:${emoji.id}> `
            else phrase += `<:${emoji.name}:${emoji.id}> `
        });
        if (phrase.length !== 0) pages.push(phrase);
        interaction.reply({content:`**Voici la liste de tous les emojis du serveur :**`, ephemeral:true})
        pages.forEach(elem => {
            interaction.followUp({content:`${elem}`,ephemeral:true}); // slash -> ephemeral
        })
    }
}