const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('Finit le lg'),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let roles = await interaction.guild.roles.cache.filter(x => x.name === "LG");
        roles.forEach(role => {
            role.delete().catch(console.error);
        })
        let allChannels = await interaction.guild.channels.cache.filter(x => x.name === "Loup garou");
        allChannels.forEach(async channel => {
            let all = await interaction.guild.channels.cache.filter(x => x.parentId === channel.id);
            all.forEach(async channel => {
                channel.delete().catch(console.error);
            });
            channel.delete().catch(console.error);
        })
    }
}