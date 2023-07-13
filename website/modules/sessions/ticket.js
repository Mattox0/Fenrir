const index = require('../../../index');

async function getTicket(id) {
	const con = index.getDB();
	let [stats] = await con.promise().query(`SELECT ticket_channel_id, ticket_category_id, ticket_role_id, ticket_message FROM servers WHERE guild_id = ?`, [id])
	if (stats.length > 0) return stats[0];
	return null;
}

module.exports.getTicket = getTicket;