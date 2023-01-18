const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let category = interaction.options.getChannel('category');
        let channel = interaction.options.getChannel('channel');
        if (!category || category.type !== "GUILD_CATEGORY") {
            category = await interaction.member.guild.channels.create("Salons privés", { 
                type: "GUILD_CATEGORY",
            });
        }
        if (!channel || channel.type !== "GUILD_VOICE" || channel.parentId !== category.id) {
            channel = await interaction.member.guild.channels.create("➕ Créer votre salon", { 
                type: "GUILD_VOICE",
                parent: category,
                permissionOverwrites: [{
                    id: interaction.member.guild.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL]
                }]
            });
        }
        db.run("UPDATE servers SET privateroom_category_id = ?, privateroom_channel_id = ? WHERE guild_id = ?", category.id, channel.id, interaction.member.guild.id, (err) => {if (err) console.log(err)});
        const win = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Le système des vocaux privées est prêt !**\n\n> Il suffit à l\'utilisateur d\'aller dans ${channel} pour avoir son propre salon`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win]});
    }
}