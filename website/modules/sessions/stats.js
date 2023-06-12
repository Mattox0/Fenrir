const index = require('../../../index');

async function getStat(id) {
	const con = index.getDB();
	let [stats] = await con.promise().query(`SELECT stats_id, stats_bot_id, stats_online_id, stats_message, stats_bot_message, stats_online_message FROM servers WHERE guild_id = ?`, [id])
	if (stats.length > 0) return stats[0];
	return null;
}

module.exports.getStat = getStat;