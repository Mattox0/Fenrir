const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mastermind')
        .setDescription('Entame une partie de mastermind'),
    async execute(...params) {
        // choix de la combinaison secrète
        const combinaison = [];
        
    }
}