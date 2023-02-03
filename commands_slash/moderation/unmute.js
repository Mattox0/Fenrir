const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Demute un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif !').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Tu n\'as pas les permissions pour executer cette commande !** \n**Appelle une personne plus qualifiée qui pourra t\'aider**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        db.get("SELECT mute_id FROM servers WHERE guild_id = ?",interaction.member.guild.id, async(err, res) => {
            if (err || !res) {
                console.error(error);
                const echec = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.reply({ embeds:[echec], ephemeral: true });
            }
            let mute;
            if (res.mute_id !== null) {
                mute = await interaction.member.guild.roles.cache.find(x => x.id === res.mute_id);
            }
            if (!mute) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Je ne trouve pas le rôle @Mute désolé !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral : true});
            }
            let person = interaction.options.getUser('utilisateur');
            person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
            person.roles.remove(mute).then(member => {
                const win = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`**${member} a été unmute !\n\n${interaction.member} a décidé de vous rendre la parole !**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                interaction.reply({embeds:[win]})
            }).catch(err => {
                console.log(err);
                const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Mon rôle doit être au dessus des autres pour que je puisse enlever le rôle !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [fail],ephemeral:true });
            });
        })
    }
}