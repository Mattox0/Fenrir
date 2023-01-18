const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const Game = require("./LG/game.js");
const end = require("./LG/end.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('werewolf')
        .setDescription('Lance une partie de loup garou | 4 joueurs minimum'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        await interaction.deferReply();
        let game = new Game();
        // ! CONFIG GAME
        await (new Promise(async (resolve, reject) => {
            await game.configGame(interaction, date, resolve);
        }))
        if (game.end) {
            await (new Promise(async (resolve, reject) => {
                await end(interaction, date, game, resolve);
            }))
            return;
        }
        await (new Promise(async (resolve, reject) => {
            await game.preGame(interaction, date, resolve);
        }))
        if (game.end) {
            await (new Promise(async (resolve, reject) => {
                await end(interaction, date, game, resolve);
            }))
            return;
        }
        await (new Promise(async (resolve, reject) => {
            await game.game(interaction, date, resolve);
        }))
        console.log("finito");
        // end
    }
}

// lancement partie
// Annoncer les rôles aux gens     |
// Lancer la pré config (cupidon)  |
// lancer la partie