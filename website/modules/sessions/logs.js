const index = require('../../../index');

async function getLogs(id) {
	const con = index.getDB();
	let [logs] = await con.promise().query(`SELECT * FROM logs WHERE guild_id = '${id}'`)
	return logs[0];
}

async function deleteLogs(id) {
	const con = index.getDB();
	await con.promise().query(`DELETE FROM logs WHERE guild_id = '${id}'`)
	await con.promise().query(`UPDATE servers SET logs_id = ${null} WHERE guild_id = '${id}'`)
}

async function isValidLogs(body, guild) {
	if (!body.logs_channel_id) return false;
	if (!guild.channels.cache.get(body.logs_channel_id)) return false;
	return true;
}

//! Faire les autres
async function updateLogs(body, id) {
	const con = index.getDB();
	console.log(body);
	await con.promise().query(`INSERT INTO logs (guild_id, logs_id, channelCreate, channelDelete, channelUpdate, messageDelete, messageUpdate, roleCreate, roleDelete, roleUpdate, emojiCreate, emojiDelete, emojiUpdate, voiceStateUpdate, guildMemberAdd, guildMemberRemove, guildBanAdd, guildBanRemove, inviteCreate, inviteDelete, stickerCreate, stickerDelete, threadCreate, threadDelete, pseudo, boost, guildScheduledEventCreate) 
	VALUES (
		'${id}', 
		'${body.logs_channel_id}', 
		${body.logs_channel_update ? 1 : 0}, 
		${body.logs_channel_update ? 1 : 0}, 
		${body.logs_channel_update ? 1 : 0},
		${body.logs_message ? 1 : 0},
		${body.logs_message ? 1 : 0},
		${body.logs_role ? 1 : 0},
		${body.logs_role ? 1 : 0},
		${body.logs_role ? 1 : 0},
		${body.logs_emoji ? 1 : 0},
		${body.logs_emoji ? 1 : 0},
		${body.logs_emoji ? 1 : 0},
		${body.logs_vocal ? 1 : 0},
		${body.logs_member ? 1 : 0},
		${body.logs_member ? 1 : 0},
		${body.logs_ban ? 1 : 0},
		${body.logs_ban ? 1 : 0},
		${body.logs_invite ? 1 : 0},
		${body.logs_invite ? 1 : 0},
		${body.logs_sticker ? 1 : 0},
		${body.logs_sticker ? 1 : 0},
		${body.logs_thread ? 1 : 0},
		${body.logs_thread ? 1 : 0},
		${body.logs_pseudo ? 1 : 0},
		${body.logs_boost ? 1 : 0},
		${body.logs_event ? 1 : 0}
		) 
	ON DUPLICATE KEY UPDATE 
		logs_id = '${body.logs_channel_id}',
		channelCreate = ${body.logs_channel_update ? 1 : 0},
		channelDelete = ${body.logs_channel_update ? 1 : 0},
		channelUpdate = ${body.logs_channel_update ? 1 : 0},
		messageDelete = ${body.logs_message ? 1 : 0},
		messageUpdate = ${body.logs_message ? 1 : 0},
		roleCreate = ${body.logs_role ? 1 : 0},
		roleDelete = ${body.logs_role ? 1 : 0},
		roleUpdate = ${body.logs_role ? 1 : 0},
		emojiCreate = ${body.logs_emoji ? 1 : 0},
		emojiDelete = ${body.logs_emoji ? 1 : 0},
		emojiUpdate = ${body.logs_emoji ? 1 : 0},
		voiceStateUpdate = ${body.logs_vocal ? 1 : 0},
		guildMemberAdd = ${body.logs_member ? 1 : 0},
		guildMemberRemove = ${body.logs_member ? 1 : 0},
		guildBanAdd = ${body.logs_ban ? 1 : 0},
		guildBanRemove = ${body.logs_ban ? 1 : 0},
		inviteCreate = ${body.logs_invite ? 1 : 0},
		inviteDelete = ${body.logs_invite ? 1 : 0},
		stickerCreate = ${body.logs_sticker ? 1 : 0},
		stickerDelete = ${body.logs_sticker ? 1 : 0},
		threadCreate = ${body.logs_thread ? 1 : 0},
		threadDelete = ${body.logs_thread ? 1 : 0},
		pseudo = ${body.logs_pseudo ? 1 : 0},
		boost = ${body.logs_boost ? 1 : 0},
		guildScheduledEventCreate = ${body.logs_event ? 1 : 0}
		`,)
	await con.promise().query(`UPDATE servers SET logs_id = '${body.logs_channel_id}' WHERE guild_id = '${id}'`)
}

module.exports.getLogs = getLogs;
module.exports.deleteLogs = deleteLogs;
module.exports.isValidLogs = isValidLogs;
module.exports.updateLogs = updateLogs;