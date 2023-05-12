const index = require('../../../index');


async function deleteBirthday(id) {
	const con = index.getDB();
	await con.promise().query(`DELETE FROM anniversaires WHERE user_id = ${id}`)
}

async function getBirthdate(id) {
	const con = index.getDB();
	let [date] = await con.promise().query(`SELECT date FROM anniversaires WHERE user_id = ${id}`)
	if (date.length > 0) return date[0].date;
	return null;
}

async function updateBirthday(id, day, month) {
	const con = index.getDB();
	let birthday = await getBirthdate(id)
	let date = `${day || birthday.split('/')[0]}/${month || birthday.split('/')[1]}`
	await con.promise().query(`INSERT INTO anniversaires (user_id, date) VALUES ('${id}', '${date}') ON DUPLICATE KEY UPDATE date = '${date}'`)
}

async function isValidBirthday(day, month, id) {
	if ((day && !/(0[1-9]|[12]\d|3[01])/.test(day)) || (month && !/^(0?[1-9]|1[012])$/.test(month))) return false
	if ((day && !month) || (!day && month)) return false
	return true
}

async function getServerBirthday(id) {
	const con = index.getDB();
	let [birthday] = await con.promise().query(`SELECT anniv_channel_id, anniv_role_id, anniv_description, anniv_hour FROM servers WHERE guild_id = ${id}`)
	return birthday[0];
}

async function getHours() {
	let hours = []
	for (let i = 1; i <= 23; i++) {
		hours.push(`${i < 10 ? `0${i}` : i}:00`)
	}
	return hours
}

async function isValidGuildBirthday(body, guild) {
	if (!body.birthday_channel_id || !body.birthday_role_id || !body.birthday_hour) return false;
	if (!await guild.channels.cache.find(c => c.id === body.birthday_channel_id)) return false
	if (!await guild.roles.cache.find(c => c.id === body.birthday_role_id)) return false
	return true;
}

async function updateGuildBirthday(body, id) {
	const con = index.getDB();
	await con.promise().query(`UPDATE servers 
	SET anniv_channel_id = IF('${body.birthday_channel_id}' = '', anniv_channel_id, '${body.birthday_channel_id}'), 
	anniv_role_id = IF('${body.birthday_role_id}' = '', anniv_role_id, '${body.birthday_role_id}'),
	anniv_hour = IF('${body.birthday_hour}' = '', anniv_hour, '${body.birthday_hour}'),
	anniv_description = IF('${body.birthday_description}' = '', anniv_description, '${body.birthday_description}')
	WHERE guild_id = '${id}'`)
}

async function deleteGuildBirthday(id) {
	const con = index.getDB()
	await con.promise().query(`UPDATE servers SET anniv_channel_id = NULL, anniv_role_id = NULL, anniv_hour = NULL, anniv_description = NULL WHERE guild_id = ${id}`)
}

module.exports.deleteBirthday = deleteBirthday;
module.exports.getBirthdate = getBirthdate;
module.exports.updateBirthday = updateBirthday;
module.exports.isValidBirthday = isValidBirthday;
module.exports.getServerBirthday = getServerBirthday;
module.exports.getHours = getHours;
module.exports.deleteGuildBirthday = deleteGuildBirthday;
module.exports.updateGuildBirthday = updateGuildBirthday;
module.exports.isValidGuildBirthday = isValidGuildBirthday;