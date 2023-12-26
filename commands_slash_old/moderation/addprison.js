const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField, AttachmentBuilder } = require("discord.js");
const Canvas = require('canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addprison')
        .setDescription('Met quelqu\'un en prison sans supprimer le salon')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif :)').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('La raison de la mise en prison').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const noperm = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Désolé tu n'as pas la permission d'utiliser cette commande !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[noperm],ephemeral:true});
        }
        let person = interaction.options.getUser('utilisateur');
        let raison = interaction.options.getString('raison');
        if (!raison) raison = "Aucune raison n'a été donnée";
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id)
        db.query("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, async (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) return;
            res = res[0];
            if (res.prison_id === null) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Le système de prison n\'est pas activé sur ce serveur !**\n> `/setup prison`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            let prison = await interaction.member.guild.roles.cache.find(role => role.id === res.prison_role_id);
            let chann = await interaction.member.guild.channels.cache.find(chann => chann.id === res.prison_id);
            if (!prison) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Je n\'arrive pas a trouver le role `@Prison`**\n> `/setup prison`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            person.roles.add(prison).catch((error) => {
                console.error(error);
                const echec = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds:[echec], ephemeral: true });
            }).then(async (firstarg) => {
                const canvas = Canvas.createCanvas(256,256);
                const context = canvas.getContext('2d');
                const personI = await Canvas.loadImage(firstarg.user.displayAvatarURL({ extension:'png',size:256, dynamic : false}));
                context.drawImage(personI, 0, 0, canvas.width, canvas.height);
                let background = await Canvas.loadImage('./Images/jail.png')
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'jail.png'})
                const embed = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`**${person} a été envoyé en prison !**\n\n Son sort sera débattu à la suite d'une discussion avec l'équipe de modération`)
                    .setThumbnail('attachment://jail.png')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                interaction.reply({ embeds: [embed],files:[attachment] });
            })
            const tribu = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **${person}, tu es convoqué dans le tribunal !**\n\n**Le staff t'a convoqué dans notre prison, où tu devras t'expliquer pour les faits suivants qui te sont reprochés :**\n__${raison}__\n\n**Nous te rappelons que tu n'es pas ici pour t'amuser, mais pour répondre aux accusations.**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            chann.send({embeds : [ tribu ]});
            db.query("UPDATE servers SET prison_id = ? WHERE guild_id = ?", [chann.id,interaction.member.guild.id], (err) => {if (err) console.log(err)});
        })
    }
}
