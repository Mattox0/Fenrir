async function unlock(channel, game) {
    await channel.permissionOverwrites.edit(game.config.roleId, {
        SEND_MESSAGES: true,
    });
}

async function lock(channel, game) {
    await channel.permissionOverwrites.edit(game.config.roleId, {
        SEND_MESSAGES: false,
    });
}
module.exports = lock, unlock;