const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pof')
        .setDescription('Lance un pile ou face'),
    async execute(...params) {
        let interaction = params[0];
        let choix = ['🪙 Pile !','🪙 Face !'];
        return interaction.reply({content:`> ${choix[Math.floor(Math.random() * choix.length)]}`});
    }
}