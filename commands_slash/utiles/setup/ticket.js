const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        let channel = interaction.options.getChannel('channel');
        if (channel.type !== 'GUILD_TEXT') {
            const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Le salon doit être __textuel__**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true})
        }
        let category = await interaction.member.guild.channels.cache.find(channel => channel.name === "TICKETS")
        if (!category || category.deleted) {
            category = await interaction.member.guild.channels.create("TICKETS", { 
            type: "GUILD_CATEGORY",
            position : 1,
            permissionOverwrites: [{
                id: interaction.member.guild.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            }] });
        }
        let role = interaction.options.getRole('role');
        if (role) category.permissionOverwrites.edit(role, { VIEW_CHANNEL: true, SEND_MESSAGES: true, MANAGE_MESSAGES: true });
        db.run("UPDATE servers SET ticket_id = ? WHERE guild_id = ?",category.id, interaction.member.guild.id, (err) => {
            if (err) {
                console.log(err);
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> Il y a eu une erreur...')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail], ephemeral:true});
            }
            let message = interaction.options.getString('embedmessage');
            if (!message) message = `**Ticket - Support Serveur ✉️**\n\n> Un problème ?\n> Une demande particulière ?\n> Un report ?\n\n**__Comment ouvrir un ticket ?__**\n\n> Il vous suffit juste de réagir 📩,\n> et un ticket s'ouvrira !`;
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ticket')
                        .setEmoji('📩')
                        .setStyle('SUCCESS')
                )
            const ticket = new MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Ticket')
                .setDescription(message)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            channel.send({embeds:[ticket],components:[row]});
            return interaction.reply({content:'Une catégorie Tickets a été créée, c\'est ici que les tickets vont être pris en compte !', ephemeral:true});
        })
    }
};