const index = require('../../../index');

async function getTicket(id) {
	const con = index.getDB();
	let [stats] = await con.promise().query(`SELECT ticket_channel_id, ticket_category_id, ticket_role_id, ticket_message FROM servers WHERE guild_id = ?`, [id])
	if (stats.length > 0) return stats[0];
	return null;
}

async function deleteTicket(id, req) {
	const client = index.getClient();
	const con = index.getDB();
	try {
		let [ticket] = await con.promise().query(`SELECT ticket_category_id FROM servers WHERE guild_id = '${id}'`);
		ticket = ticket[0];
		const guild = client.guilds.cache.get(id);
		if (!guild) {
			res.session.errors = ['Serveur introuvable'];
			return;
		}
		let category = guild.channels.cache.find(x => x.id === ticket.ticket_category_id);
		let channels = guild.channels.cache.filter(x => x.parentId == ticket.ticket_category_id);
		if (category) {
			for (const [_, channel] of channels) channel.delete()
			category.delete();
		}
	} catch (e) {
		req.session.errors = ["Une erreur est survenue"];
		return;
	}
	await con.promise().query(`UPDATE servers SET ticket_channel_id = ?, ticket_category_id = ?, ticket_role_id = ?, ticket_message = ? WHERE guild_id = ?`, [null, null, null, null, id])
}

module.exports.getTicket = getTicket;
module.exports.deleteTicket = deleteTicket;