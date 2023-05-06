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
	console.log(date)
	await con.promise().query(`INSERT INTO anniversaires (user_id, date) VALUES ('${id}', '${date}') ON DUPLICATE KEY UPDATE date = '${date}'`)
}

async function isValidBirthday(day, month, id) {
	if ((day && !/(0[1-9]|[12]\d|3[01])/.test(day)) || (month && !/^(0?[1-9]|1[012])$/.test(month))) return false
	if ((day && !month) || (!day && month)) return false
	return true
}


module.exports.deleteBirthday = deleteBirthday;
module.exports.getBirthdate = getBirthdate;
module.exports.updateBirthday = updateBirthday;
module.exports.isValidBirthday = isValidBirthday;