const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription('Affiche la photo quotidienne de la NASA'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const wait = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Génération de l\'image** <a:LMT_loading:1065616439836414063>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        try {
            fetch('https://api.nasa.gov/planetary/apod?api_key=sRFBrgTBrx9bXnrJOZ4W3g430WX7UQksueOLSuOe')
            .then(r => r.json())
            .then(data => {
                const nasa = new EmbedBuilder()
                    .setTitle(`Photo du jour`)
                    .setDescription('La NASA propose une photo chaque jour !')
                    .setImage(data["url"] ? data["url"] : data["hdurl"])
                    .setColor('#2f3136')
                return interaction.editReply({ embeds : [ nasa ]});
            });
        } catch (e) {
            console.error(e);
			const echec = new EmbedBuilder()
				.setColor('#2f3136')
				.setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
				.setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
			await interaction.editReply({ embeds:[echec], ephemeral: true });
        };
    }
}