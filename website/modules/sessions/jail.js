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
	con.query(`UPDATE servers SET prison_admin_id = ${body.prison_admin_role_id} WHERE guild_id = ${id}`)
	const client = index.getClient();
	try {
		console.log(req.body);
		const guild = client.guilds.cache.get(req.body.guild_id);
		let [prison] = await con.promise().query(`SELECT prison_id, prison_role_id, prison_category_id FROM servers WHERE guild_id = '${req.body.guild_id}'`);
		prison = prison[0];
		if (!guild) {
			res.session.errors = ['Serveur introuvable'];
			return res.status(202).send({
				status : 'error',
				guild_id : req.body.guild_id
			});
		}
		let channel = guild.channels.cache.find(x => x.id === prison.prison_id)
		if (!channel) {
			res.session.errors = ['Prison introuvable'];
			return res.status(202).send({
				status : 'error',
				guild_id : req.body.guild_id
			});
		}
		let role = guild.roles.cache.find(x => x.id === req.body.prison_admin_id);
		if (!role) {
			res.session.errors = ['Rôle admin introuvable'];
			return res.status(202).send({
				status : 'error',
				guild_id : req.body.guild_id
			});
		}
		channel.permissionOverwrites.edit(role, { ViewChannel: true, SendMessages: true, ManageMessages: true });
	} catch (e) {
		req.session.errors = ["Une erreur est survenue"];
		return res.status(202).send({
			status : 'error',
			guild_id : req.body.guild_id
		}); 
	}
	req.session.success = ["La prison a bien été mise à jour"];
	return res.status(200).send({
		status : 'success',
		guild_id : req.body.guild_id
	});
}

module.exports.getJail = getJail;
module.exports.deleteJail = deleteJail;
module.exports.isValidJail = isValidJail;
module.exports.updateJail = updateJail;