const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Verrouille un salon')
        .addStringOption(option => option.setName('raison').setDescription('La raison du verrouillage').setRequired(false))
        .addChannelOption(option => option.setName('channel').setDescription('le salon a vérrouiller | Si vous ne mettez rien, ce sera le salon actuel').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Tu n\'as pas les permissions pour executer cette commande !** \n**Appelle une personne plus qualifiée qui pourra t\'aider**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        let raison = interaction.options.getString('raison');
        if (!raison) raison = "Aucune raison spécifiée !";
        let channel = interaction.options.getChannel('channel');
        if (!channel) channel = interaction.member.guild.channels.cache.find(x => x.id === interaction.channelId);
        else {
            if (channel.type !== ChannelType.GuildText) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Le salon doit être textuel !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
        }
        channel.permissionOverwrites.edit(interaction.member.guild.id, { SendMessages : false });
        const lock = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **${channel} à été verrouillé**\n\n*Si cette commande ne marche pas, vérifiez vos permissions*`)
            .setThumbnail('https://media.discordapp.net/attachments/883117525842423898/920759073614495785/1f512.png')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            .addFields(
                { name: `Raison`, value:`${raison}`, inline : true },
                { name: `Modérateur`, value:`${interaction.member}`, inline : true},
            )
        return interaction.reply({ embeds : [lock]});
    }
}