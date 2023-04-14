const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    async execute(interaction, date) {
        // await interaction.deferReply();
        const emojis = interaction.member.guild.emojis.cache
        let count = 0;
        let first = true;
        let phrase = [];
        for (let emoji of emojis.values()) {
            count++;
            phrase.push(`${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`} **${emoji.name}** \`${emoji.id}\``);
            if (count === 25) {
                count = 0;
                const emoteEmbed = new EmbedBuilder()
                    .setTitle(`Liste des emotes \`${emojis.size} emotes \``)
                    .setColor('#2f3136')
                    .setDescription(phrase.join('\n'))
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                if (first) {
                    first = false;
                    await interaction.reply({embeds:[emoteEmbed]}); 
                } else {
                    first = false;
                    await interaction.followUp({embeds:[emoteEmbed]});
                }
                phrase = [];
            }
        }
        
        if (phrase.length != 0) {
            const emoteEmbed = new EmbedBuilder()
            .setTitle(`Liste des emotes \`${emojis.size} emotes\``)
            .setColor('#2f3136')
            .setDescription(phrase.join('\n'))
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            if (first) {
                await interaction.reply({embeds:[emoteEmbed]})
            } else {
                await interaction.followUp({embeds:[emoteEmbed]})
            }
        }
    }
}