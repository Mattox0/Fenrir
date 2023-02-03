const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pose une question au bot')
        .addStringOption(option => option.setName('question').setDescription('Votre question | Exemple : "Il va faire beau demain ?"').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let question = interaction.options.getString('question');
        let phrase = ['Sans aucun doute','Malheuresement, c\'est sans espoir','Oui, sans aucune hésitation','Mes sources disent que non','Ne compte pas dessus','Oui !','Non !','Ptdr t\'es qui ?','Roh laisse moi','Bien sûr que oui !','Bien sûr que non !','Pourquoi tu poses cette question, t\'es jaloux ?','Eh tu prends la confiance fréro','Ouaiiiiiiis évidemment !','Non mais ptdr t\'es fou','Nooooooooooon','Je sais pas moi jsuis pas dieu','Laisse moi dormir !','T\'es trop curieux','Ouais t\'inquiètes','Cherche pas','C\'est non','Ouiiiiiiiiiiiiiiii','Et pourquoi pas ?'];
        const reponse = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **${question}**\n\n> \`${phrase[Math.floor(Math.random() * phrase.length)]}\``)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[reponse]});
    }
}