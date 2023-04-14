async function unlock(channel, game) {
    await channel.permissionOverwrites.edit(game.config.roleId, {
        SendMessages: true,
    });
}

async function lock(channel, game) {
    await channel.permissionOverwrites.edit(game.config.roleId, {
        SendMessages: false,
    });
}
module.exports = lock, unlock;