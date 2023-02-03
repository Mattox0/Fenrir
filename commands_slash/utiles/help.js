const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la page d\'aide des commandes'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_help')
                    .setPlaceholder('Accueil')
                    .addOptions([
                        {
                            label: 'Accueil',
                            emoji:'🏘️',
                            description: 'Accueil',
                            value: 'accueil'
                        },{
                            label: 'Setup',
                            emoji:'⚙️',
                            description: 'Installez les systèmes du bot',
                            value: 'setup'
                        },{
                            label: 'Disable',
                            emoji:'🚫',
							description: 'Désactive les systèmes activé avec Setup',
							value: 'disable',
                            label: 'Jeux',
                            emoji:'🎮',
							description: 'L\'ensemble des jeux à jouer avec vos amis',
							value: 'game',
                        },{
                            label: 'Images',
                            emoji:'📷',
                            description: 'Modifiez vos photo de profil',
                            value: 'image',
                        },{
                            label: 'Modération',
                            emoji:'🔨',
                            description: 'Toutes les commandes de Modérations',
                            value: 'modo',
                        },{
                            label: 'Utiles',
                            emoji:'💡',
                            description: 'Commandes utiles',
                            value: 'utile',
                        },{
                            label: 'Social',
                            emoji:'💞',
                            description: 'Interactions avec d\'autres utilisateurs',
                            value: 'interaction',
                        },{
                            label: 'Animaux',
                            emoji:'🐶',
                            description: 'Affichez vos animaux favoris',
                            value: 'animals',
                        },{
                            label: 'Activitées',
                            emoji:'📡',
                            description: 'Lancez les activitées de Discord',
                            value: 'activity',
                        },{
                            label: 'Fun',
                            emoji:'🎉',
                            description: 'Toutes les commandes amusantes',
                            value: 'fun',
                        }
                    ])
            )
        // Setup Disable Interaction Animaux Activitées Jeux Fun Images Modération Utiles 
        const win = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({name:'🏘️ ・ Accueil'})
            .setDescription(`<a:LMT_arrow:1065548690862899240> Choississez une catégorie pour avoir les commandes correspondantes\n\n> [Support](https://discord.gg/p9gNk4u)`)
            .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[win], components:[row]});
    }
}