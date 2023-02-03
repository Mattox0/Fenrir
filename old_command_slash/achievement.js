const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require("discord.js")
const Canvas = require('canvas');
Canvas.registerFont('./Fonts/Minecraft.ttf', { family: 'Minecraft' })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievement')
        .setDescription('Cree un achievement minecraft')
        .addStringOption(option => option.setName('texte').setDescription('Votre achievement | Exemple : "Avoir tous les succès"').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let text = interaction.options.getString('texte');
        if (text.length > 30) text = `${text.slice(0,30)}...`
        const canvas = Canvas.createCanvas(320, 64);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./Images/minecraft.png')
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '12px Minecraft';
        context.fillStyle = '#ffffff';
        context.fillText(text, 60, 48);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name:'achievement.png' })
        return interaction.reply({files:[attachment]})
    }
}