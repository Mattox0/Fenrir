const index = require('../../../index');

async function getRoom(id) {
	const con = index.getDB();
	let [room] = await con.promise().query(`SELECT privateroom_category_id, privateroom_channel_id FROM servers WHERE guild_id = ${id}`)
	if (room.length > 0) return room[0];
	return null;
}

module.exports.getRoom = getRoom;