const index = require('../../../index');

async function getSuggest(id) {
	const con = index.getDB();
	let [stats] = await con.promise().query(`SELECT suggestion_id FROM servers WHERE guild_id = ?`, [id])
	if (stats.length > 0) return stats[0];
	return null;
}

async function deleteSuggest(id) {
	const con = index.getDB();
	await con.promise().query(`UPDATE servers SET suggestion_id = ? WHERE guild_id = ?`, [null, id])
}

async function validSuggest(body, guild) {
	if (body.sugg_channel_id == null) return false;
	if (!await guild.channels.cache.find(c => c.id === body.sugg_channel_id)) return false
	return true
}

async function updateSuggest(body, id) {
	const con = index.getDB();
	await con.promise().query(`UPDATE servers SET suggestion_id = ? WHERE guild_id = ?`, [body.sugg_channel_id, id])
}

module.exports.getSuggest = getSuggest;
module.exports.deleteSuggest = deleteSuggest;
module.exports.validSuggest = validSuggest;
module.exports.updateSuggest = updateSuggest;
