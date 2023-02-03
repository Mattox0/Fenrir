const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Affiche toutes les informations du serveur'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let id = interaction.member.guild.id;
        let name = interaction.member.guild.name;
        let nbboost = interaction.member.guild.premiumSubscriptionCount;
        let level = 0
        if (nbboost >= 2) level = 1 
        if (nbboost >= 7) level = 2 
        if (nbboost >= 14) level = 3
        let nbmembers = interaction.member.guild.memberCount;
        let roles = 0;
        interaction.member.guild.roles.cache.forEach(() => roles++);
        let channels = 0;
        interaction.member.guild.channels.cache.forEach(() => channels++);
        let created = `<t:${Math.floor(interaction.member.guild.createdTimestamp / 1000)}:f> (<t:${Math.floor(interaction.member.guild.createdTimestamp / 1000)}:R>)`;
        guildWithPresence = await interaction.member.guild.members.fetch({withPresences : true});
        let onlines = guildWithPresence.filter((online) => online.presence?.status === "online" || online.presence?.status === "idle" || online.presence?.status === "dnd").size;
        let emojis = 0;
        interaction.member.guild.emojis.cache.forEach(() => emojis++);
        let description = interaction.member.guild.description ? interaction.member.guild.description : "Aucune description n'a été donnée";
        let fowner = await interaction.member.guild.fetchOwner();
        let owner = `${fowner}\n\`${fowner.user.username}#${fowner.user.discriminator}\``;
        let thumbnail = interaction.member.guild.iconURL({ dynamic: true });
        const userinfo = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Toutes les informations sur le serveur :')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            .addFields(
                { name: 'Identifiant', value:id, inline: true },
                { name: 'Nom du serveur', value:name, inline: true },
                { name: 'Propriétaire du serveur', value:owner, inline: true},
                {name : 'Description', value:description, inline: false},
                { name: 'Boosts sur le serveur', value: `${nbboost} \n\`Niveau ${level}\``,inline: false},
                { name: 'Emojis', value:`${emojis}`,inline: true },
                { name: 'Rôles', value:`${roles}`, inline: true },
                { name: 'Salons', value:`${channels}`, inline: true },
                { name: 'Date de création du serveur', value:created, inline: false },
                { name: 'Membres', value: `${nbmembers}`, inline: true},
                { name: 'Membres en ligne', value: `${onlines}`, inline: true},
            )
            .setThumbnail(thumbnail)
        return interaction.reply({ embeds:[userinfo]});
    }
}
