const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,  Permissions, MessageAttachment } = require("discord.js");
const Canvas = require('canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('liberate')
        .setDescription('Libere quelqu\'un de la prison')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif :)').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const noperm = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Désolé tu n'as pas la permission d'utiliser cette commande !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[noperm],ephemeral:true});
        }
        let person = interaction.options.getUser('utilisateur');
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id)
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
            if (!prison) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT__arrow:831817537388937277> **Je n\'arrive pas a trouver le role `@Prison`**\n> `/setup prison`')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            
            person.roles.remove(prison).catch((error) => {
                console.error(error);
                const echec = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **L'utilisateur est déjà libre !**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds:[echec], ephemeral: true });
            }).then(async (firstarg) => {
                const embed = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> ${firstarg} a été libéré de **prison** !\n\nIl peut retourner vacquer à ses occupations.`)
                    .setThumbnail('https://cdn.discordapp.com/attachments/874972482275278868/884801954734305380/861237053525721108.png')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds: [embed] });
            })
        })
    }
}