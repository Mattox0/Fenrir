const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType} = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let category = interaction.options.getChannel('category');
        let channel = interaction.options.getChannel('channel');
        if (!category || category.type !== ChannelType.GuildCategory) {
            category = await interaction.member.guild.channels.create({
                name: "Salons privés",
                type: ChannelType.GuildCategory
            }).catch(async () => {
                const err = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Je n'ai pas réussi à creer la catégorie**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.reply({embeds:[err], ephemeral:true});
            });
        }
        if (!channel || channel.type !== ChannelType.GuildVoice || channel.parentId !== category.id) {
            channel = await interaction.member.guild.channels.create({
                name: "➕ Créer votre salon",
                type: ChannelType.GuildVoice,
                parent: category,
                permissionOverwrites: [{
                    id: interaction.member.guild.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }]
            }).catch(async () => {
                const err = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Je n'ai pas réussi à creer le salon**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.reply({embeds:[err], ephemeral:true});
            });
        }
        db.query("UPDATE servers SET privateroom_category_id = ?, privateroom_channel_id = ? WHERE guild_id = ?", [category.id, channel.id, interaction.member.guild.id], (err) => {if (err) console.log(err)});
        const win = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Le système des vocaux privées est prêt !**\n\n> Il suffit à l\'utilisateur d\'aller dans ${channel} pour avoir son propre salon`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win]});
    }
}