const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,  Permissions, MessageAttachment } = require("discord.js");
const Canvas = require('canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prison')
        .setDescription('Met quelqu\'un en prison | Attention cette commande nuke le tribunal | /addprison pour l\'ajouter')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif :)').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('La raison de la mise en prison').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        let person = interaction.options.getUser('utilisateur');
        let raison = interaction.options.getString('raison');
        if (!raison) raison = "Aucune raison n'a été donnée"
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id)
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const noperm = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Désolé tu n'as pas la permission d'utiliser cette commande !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[noperm],ephemeral:true});
        }
        db.get("SELECT * FROM servers WHERE guild_id = ?",interaction.member.guild.id, async (err, res) => {
            if (err || !res) {
                return console.log(err);
            }
            if (res.prison_id === null) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Le système de prison n\'est pas activé sur ce serveur !**\n> `/setup prison`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            let prison = await interaction.member.guild.roles.cache.find(role => role.id === res.prison_role_id);
            let chann = await interaction.member.guild.channels.cache.find(chann => chann.id === res.prison_id);
            let role = await interaction.member.guild.roles.cache.find(role => role.id === res.prison_admin_id);
            if (!prison) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Je n\'arrive pas a trouver le role `@Prison`**\n> `/setup prison`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            person.roles.add(prison).catch((error) => {
                console.error(error);
                const echec = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds:[echec], ephemeral: true });
            }).then(async (firstarg) => {
                const canvas = Canvas.createCanvas(256,256);
                const context = canvas.getContext('2d');
                const personI = await Canvas.loadImage(firstarg.user.displayAvatarURL({ format:'png',size:256, dynamic : false}));
                context.drawImage(personI, 0, 0, canvas.width, canvas.height);
                let background = await Canvas.loadImage('./Images/jail.png')
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                const attachment = new MessageAttachment(canvas.toBuffer(), 'jail.png')
                const embed = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`**${person} a été envoyé en prison !**\n\nSon sort sera débattu à la suite d'une discussion avec l'équipe de Modération`)
                    .setThumbnail('attachment://jail.png')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                interaction.reply({ embeds: [embed],files:[attachment] });
            })
            chann.delete();
            chann = await interaction.member.guild.channels.create("tribunal", { 
                type: "GUILD_TEXT",
                position : 1,
                permissionOverwrites: [{
                    id: interaction.member.guild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL]
                }, {
                    id: prison.id,
                    allow:[Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                }]
            }).then((tribunal) => {
                if (role) tribunal.permissionOverwrites.edit(role, { VIEW_CHANNEL: true, SEND_MESSAGES: true, MANAGE_MESSAGES: true });
                tribunal.send(`@here, ${person}`).then(mess => mess.delete());
                const tribu = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **${person}, tu es convoqué dans le Tribunal !**\n\n**Le staff t'a convoqué dans notre prison, où tu devras t'expliquer pour les faits suivants qui te sont reprochés :**\n__${raison}__\n\n**Nous te rappelons que tu n'es pas ici pour t'amuser, mais pour répondre aux accusations.**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                tribunal.send({embeds : [ tribu ]});
                db.run("UPDATE servers SET prison_id = ? WHERE guild_id = ?",tribunal.id,interaction.member.guild.id, (err) => {if (err) console.log(err)});  
            });
        })
    }
}
