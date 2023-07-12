const index = require('../../../index');

async function getSuggest(id) {
	const con = index.getDB();
	let [stats] = await con.promise().query(`SELECT suggestion_id FROM servers WHERE guild_id = ?`, [id])
	if (stats.length > 0) return stats[0];
	return null;
}

module.exports.getSuggest = getSuggest;