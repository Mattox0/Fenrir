const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let date = new Date();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sugg')
        .setDescription('Propose une suggestion !')
        .addStringOption(option => option.setName('message').setDescription('Le contenu de votre suggestion').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let message = interaction.options.getString('message');
        db.get("SELECT suggestion_id FROM servers WHERE guild_id = ?",interaction.member.guild.id, async (err, res) => {
            if (err) {
                console.log(err);
                return interaction.reply({content:'Désolé il y a eu une erreur...',ephemeral:true});
            }
            const fail = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('<a:LMT__arrow:831817537388937277> **Le systeme de suggestion n\'est pas activé**\n\n> \`/setup suggestion <channel>\`')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            if (!res || res.suggestion_id === null) return interaction.reply({embeds:[fail],ephemeral:true});
            let channel = await interaction.member.guild.channels.cache.find(x => x.id === res.suggestion_id);
            if (!channel) return interaction.reply({embeds:[fail],ephemeral:true});
            const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`**${interaction.member} a proposé cette suggestion :**\n\n > ${message}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            channel.send({ embeds: [embed] }).then(async message => {
                await message.startThread({
                    name: `Réponse à la suggestion de ${interaction.member.user.username}`,
                    autoArchiveDuration: 'MAX',
                    reason: 'Suggestion',
                });
            })
            interaction.reply({content:'**Suggestion envoyé avec succés !** <:LMT_Agg:882250214050775090>'})
        })
    }
}