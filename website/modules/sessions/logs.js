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
	await con.promise().query(`INSERT INTO logs (guild_id, logs_id, channelCreate, channelDelete, channelUpdate) 
	VALUES (
		'${id}', 
		'${body.logs_channel_id}', 
		${body.logs_channel_update ? 1 : 0}, 
		${body.logs_channel_update ? 1 : 0}, 
		${body.logs_channel_update ? 1 : 0}
		) 
	ON DUPLICATE KEY UPDATE 
		logs_id = '${body.logs_channel_id}',
		channelCreate = ${body.logs_channel_update ? 1 : 0},
		channelDelete = ${body.logs_channel_update ? 1 : 0},
		channelUpdate = ${body.logs_channel_update ? 1 : 0}
		`,)
	await con.promise().query(`UPDATE servers SET logs_id = '${body.logs_channel_id}' WHERE guild_id = '${id}'`)
}

module.exports.getLogs = getLogs;
module.exports.deleteLogs = deleteLogs;
module.exports.isValidLogs = isValidLogs;
module.exports.updateLogs = updateLogs;