const index = require('../../../index');

async function getJail(id) {
	const con = index.getDB();
	let [jail] = await con.promise().query(`SELECT prison_id, prison_role_id, prison_admin_id FROM servers WHERE guild_id = ${id}`)
	return jail[0];
}

module.exports.getJail = getJail;