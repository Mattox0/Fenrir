const index = require('../../../index');

async function getRoom(id) {
	const con = index.getDB();
	let [room] = await con.promise().query(`SELECT privateroom_category_id, privateroom_channel_id FROM servers WHERE guild_id = ${id}`)
	if (room.length > 0) return room[0];
	return null;
}

async function validRoom(body, guild) {
	if (!body.room_channel_id) return false;
	if (!body.room_category_id) return false;
	let channel = guild.channels.cache.find(x => x.id === body.room_channel_id);
	let category = guild.channels.cache.find(x => x.id === body.room_category_id);
	if (channel.parent !== category) return false;
	return true;
}
async function updateRoom(body, id) {
	const con = index.getDB();
	await con.promise().query(`UPDATE servers SET privateroom_channel_id = ?, privateroom_category_id = ? WHERE guild_id = ?`, [body.room_channel_id, body.room_category_id, id], (err) => { if (err) throw err; });
}

module.exports.getRoom = getRoom;
module.exports.validRoom = validRoom;
module.exports.updateRoom = updateRoom;