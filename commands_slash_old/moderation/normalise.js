const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('normalise')
        .setDescription('Enleve les caracteres spéciaux du pseudo d\'un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif :)').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            const noperm = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Désolé tu n'as pas la permission d'utiliser cette commande !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[noperm],ephemeral:true});
        }
        let person = interaction.options.getUser('utilisateur');
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id)
        let pseudo = person.nickname ? person.nickname : person.user.username;
        let pseudo2 = pseudo.replace(/[^a-zA-Z0-9]/g, '');
        if (pseudo2 === '') pseudo2 = 'Pseudo à changer';
        if (pseudo === pseudo2) {
            let embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Il n'y a rien à changer**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[embed]}); 
        }
        person.setNickname(pseudo2);
        let embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **\`${pseudo}\` devient \`${pseudo2}\`**\n> ${person}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[embed]});
    }
}
