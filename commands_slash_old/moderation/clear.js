const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,  PermissionsBitField } = require("discord.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Efface un nombre de messages dans un salon')
        .addIntegerOption(option => option.setName('messages').setDescription('Combien de messages voulez vous supprimer ?').setRequired(true))
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous choississez un utilisateur, seuls ses messages seront supprimés').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Tu n\'as pas les permissions pour executer cette commande !** \n**Appelle une personne plus qualifiée qui pourra t\'aider**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        let amount = interaction.options.getInteger('messages');
        let user = interaction.options.getUser('utilisateur');
        let messages = await interaction.channel.messages.fetch();
        console.log(messages)
        if (user) {
            const targetMessages = messages.filter((m) => m.author.id === user.id );
            let messagesBulk = await interaction.channel.bulkDelete(targetMessages.first(amount), true);
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **${messagesBulk.size} messages de ${user} ont été supprimés avec succès**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await interaction.reply({embeds:[win]});
            await wait(5000);
            await interaction.deleteReply();
        } else {
            await interaction.channel.bulkDelete(amount, true);
            const win = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **${amount} messages ont été supprimés avec succès**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            await interaction.reply({embeds:[win]});
            await wait(5000);
            await interaction.deleteReply();
        }
    }
}