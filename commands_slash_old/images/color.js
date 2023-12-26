const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Affiche une couleur grace à un code hexadécimal')
        .addStringOption(option => option.setName('code').setDescription('Le code hexadécimal | Exemple : 2a3136 ou random').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let color = interaction.options.getString('code');
        if (color === 'random') {
            color = `${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`
        } else if (!color.match(/^[a-z0-9]+$/i) || color.length !== 6) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **\`${color}\` n\'est pas un code hexadécimal !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true});
        }
        const wait = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<a:LMT_arrow:1065548690862899240> **Génération de l\'image** <a:LMT_loading:1065616439836414063>')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({embeds:[wait]});
        let link = `https://some-random-api.ml/canvas/colorviewer/?hex=${color}`;
        let link2 = `https://some-random-api.ml/canvas/rgb/?hex=${color}`;
        let attachment = new AttachmentBuilder(await link, { name: 'color.png' });
        fetch(link2)
        .then(response => response.json())
        .then(data => {
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`**Hex** : ${color}\n\n**rgb** : (${data["r"]}, ${data["g"]}, ${data["b"]})`)
                .setThumbnail('attachment://color.png')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            interaction.editReply({embeds:[embed],files:[attachment]});
        }).catch(err => {
            console.log(err)
            const echec = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.editReply({ embeds:[echec], ephemeral: true });
        });
    }
}