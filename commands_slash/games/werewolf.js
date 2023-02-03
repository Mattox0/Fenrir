const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loupgarou')
        .setDescription('Entame une partie de loup garou (4 joueurs minimum)'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        await require('../../werewolf/werewolf.js').execute(interaction,date);
    }
}