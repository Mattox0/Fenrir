const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('triggered')
        .setDescription('Cree une image "triggered" de sa photo de profil ou de celle d\'un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affichera votre photo').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let person = interaction.options.getUser('utilisateur');
        if (!person) person = interaction.member;
        else person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        const wait = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Génération de l\'image** <a:LMT_loading:1065616439836414063>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        let link = `https://some-random-api.ml/canvas/triggered/?avatar=${person.user.displayAvatarURL({ extension: 'png' })}`
        let attachment = new AttachmentBuilder(link, { name: 'triggered.gif' });
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setImage('attachment://triggered.gif')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        interaction.editReply({embeds:[embed],files:[attachment]})
    }
}