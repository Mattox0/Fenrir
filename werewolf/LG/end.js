const wait = require('util').promisify(setTimeout);

async function end(interaction, date, game, resolve) {
    await wait(5000);
    if (game.config.roleId) {
        let role = await interaction.guild.roles.cache.find(x => x.id === game.config.roleId);
        console.log(role);
        role.delete().catch(console.error);
    }
    if (game.config.categoryId) {
        allChannels = await interaction.guild.channels.cache.filter(x => x.parentId === game.config.categoryId);
        allChannels.forEach(async channel => {
            channel.delete().catch(console.error);
        });
        category = await interaction.guild.channels.cache.find(x => x.id === game.config.categoryId);
        category.delete().catch(console.error);
    }
    resolve();
}
module.exports = end;