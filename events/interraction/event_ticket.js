const {EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder} = require('discord.js');
let date = new Date()

module.exports = {
    name:'ticket',
    description:'Ouvre un ticket',
    async execute(...params) {
        let interaction = params[0];
        let db = params[3]
        db.get("SELECT ticket_id FROM servers WHERE guild_id = ?", interaction.member.guild.id, (err, res) => {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le systeme de ticket n\'est pas configuré !**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            if (err) {
                console.log(err)
                const embed = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> Il y a eu une erreur...')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[embed],ephemeral:true});
            } else if (!res) {
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            let category = interaction.member.guild.channels.cache.find(channel => channel.id === res.ticket_id);
            if (!category) return interaction.reply({embeds:[fail],ephemeral:true});
            db.each("SELECT * FROM tickets WHERE guild_id = ?",interaction.member.guild.id, (err, res) => {
                if (err || !res) return;
                for (channel of category.children) {
                    if (channel[0] == res.channel_id) return
                }
                db.run("DELETE FROM tickets WHERE id = ?", res.id, (err) => {if (err) console.log(err)});
            })
            db.all("SELECT user_id, deleted FROM tickets WHERE guild_id = ?", interaction.member.guild.id, async (err,res) => {
                if (err) {
                    console.log(err)
                    const embed = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> Il y a eu une erreur...')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.reply({embeds:[embed],ephemeral:true});
                }
                if (res.some(x => x.deleted === 0 && x.user_id === interaction.member.user.id)) {
                    const fail = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT_arrow:1065548690862899240> **Vous avez déjà un ticket ouvert à votre nom !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.reply({embeds:[fail], ephemeral:true})
                }
                try {
                    chann = await interaction.member.guild.channels.create(`ticket-${interaction.member.user.discriminator}`, { 
                    type: "GUILD_TEXT",
                    parent: category,
                    permissionOverwrites: [{
                        id: interaction.member.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }] })
                    chann.lockPermissionsBitField();
                    chann.permissionOverwrites.edit(interaction.member, {VIEW_CHANNEL:true, SEND_MESSAGES:true});
                } catch (e) {
                    console.log(e)
                    return interaction.reply({content:'Une erreur est survenue !', ephemeral:true});
                }
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ticket_close')
                            .setLabel('🔒 Fermer')
                            .setStyle(ButtonStyle.Secondary)
                    )
                const mess = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **${interaction.member}, tu as ouvert un ticket !\n\nLe support est là pour répondre à tes questions**\n\n> Pour fermer le ticket appuie sur 🔒`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                chann.send({embeds:[mess],components:[row]});
                here = await chann.send({content:'@here'});
                here.delete();
                await db.run('INSERT INTO tickets (guild_id, user_id, channel_id) VALUES (?,?,?)',interaction.member.guild.id,interaction.member.user.id,chann.id, err => {if (err) console.log(err)});
                interaction.deferUpdate();
            })
        })
        
    }
}