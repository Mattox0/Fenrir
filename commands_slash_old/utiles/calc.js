const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const math = require("mathjs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Je calcule à ta place !')
        .addStringOption(option => option.setName('expression').setDescription('Exemple : 2*3+5').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let expression = interaction.options.getString('expression');
        let result;
        try{
            result = math.evaluate(expression);
        } catch (e) {
            const fail = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Votre expression n'est pas bonne**\n\n> \`/calc 5*2+9\``)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [ fail ], ephemeral:true });;
        };
        const calc = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **${expression}**\n\n> ${result}`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[calc]});
    }
}