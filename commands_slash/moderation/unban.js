const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Débannit un utilisateur')
        .addStringOption(option => option.setName('utilisateur').setDescription('Son Username ou son ID').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Tu ne peux pas faire justice toi-même !** \n**Appelle une personne plus qualifiée qui pourra t\'**\n**aider dans la démarche du bannissement**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        let person = interaction.options.getString('utilisateur');
        const banList = await interaction.member.guild.bans.fetch();
        person = banList.find(user => user.user.id === person || user.user.username === person);
        if (!person) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Je ne trouve pas cet utilisateur !**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds : [ fail ],ephemeral : true});
        }
        interaction.member.guild.members.unban(person.user).then((member) => {
            db.run('DELETE FROM bans WHERE user_id = ?',member.id, (err) => {if (err) throw err });
            const unban = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **${member} a été débanni par ${interaction.member}!**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [unban]});
        }).catch(() => {
            const fail = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Je n'ai pas réussi à unban cet utilisateur**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [ fail ],ephemeral:true });
        });
    }
}