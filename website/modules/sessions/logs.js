const index = require('../../../index');

async function getLogs(id) {
	const con = index.getDB();
	let [logs] = await con.promise().query(`SELECT * FROM logs WHERE guild_id = '${id}'`)
	return logs[0];
}

module.exports.getLogs = getLogs;