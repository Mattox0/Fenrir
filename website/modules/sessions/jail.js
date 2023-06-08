const index = require('../../../index');

async function getJail(id) {
	const con = index.getDB();
	let [jail] = await con.promise().query(`SELECT prison_id, prison_role_id, prison_admin_id, prison_category_id FROM servers WHERE guild_id = ${id}`)
	return jail[0];
}

async function deleteJail(id) {
	const con = index.getDB();
	con.query(`UPDATE servers SET prison_id = null, prison_role_id = null, prison_admin_id = null, prison_category_id = null WHERE guild_id = ${id}`)
}

async function isValidJail(body, guild) {
	if (!guild.roles.cache.get(body.prison_admin_role_id)) return false;
	return true;
}

async function updateJail(body, id) {
	const con = index.getDB();
	con.query(`UPDATE servers SET prison_id = ${body.prison_id}, prison_role_id = ${body.prison_role_id}, prison_admin_id = ${body.prison_admin_role_id}, prison_category_id = ${body.prison_category_id} WHERE guild_id = ${id}`)
}

module.exports.getJail = getJail;
module.exports.deleteJail = deleteJail;
module.exports.isValidJail = isValidJail;
module.exports.updateJail = updateJail;