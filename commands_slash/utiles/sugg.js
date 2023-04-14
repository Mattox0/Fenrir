const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
let date = new Date();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Propose une suggestion !')
        .addStringOption(option => option.setName('message').setDescription('Le contenu de votre suggestion').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let con = params[4];
        let message = interaction.options.getString('message');
        con.query("SELECT suggestion_id FROM servers WHERE guild_id = ?",interaction.member.guild.id, async (err, rows) => {
            if (err) {
                console.log(err);
                return interaction.reply({content:'Désolé il y a eu une erreur...', ephemeral:true});
            }
            // check rows si null ou vide
            for (let res of rows) {
                const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le systeme de suggestion n\'est pas activé dans ce server**\n\n> \`/setup suggestion <channel>\`')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                if (!res || res.suggestion_id === null) return interaction.reply({embeds:[fail],ephemeral:true});
                let channel = await interaction.member.guild.channels.cache.find(x => x.id === res.suggestion_id);
                if (!channel) return interaction.reply({embeds:[fail],ephemeral:true});
                const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`**${interaction.member} a proposé cette suggestion :**\n\n > ${message}`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                channel.send({ embeds: [embed] }).then(async message => {
                    await message.startThread({
                        name: `Réponse à la suggestion de ${interaction.member.user.username}`,
                        reason: 'Suggestion',
                    });
                })
                interaction.reply({content:'**Suggestion envoyé avec succés !** <a:LMT_fete2:911791997428334622>'})
            }
        })
    }
}