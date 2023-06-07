const express = require('express');
const index = require('../../index');
const { PermissionsBitField, ChannelType } = require('discord.js');

const router = express.Router();

router.post('/jail/create', async (req, res) => {
	const client = index.getClient();
	const con = index.getDB();
	try {
		const guild = client.guilds.cache.get(req.body.guild_id);
		if (!guild) {
			res.session.errors = ['Serveur introuvable'];
			return res.redirect('/servers/' + req.body.guild_id + '/jail');
		}
		let prison = await guild.roles.create({
			name: 'Prison',
			color: '#000001',
			reason: 'N\'y touche pas ! J\'en ai besoin pour la prison',
		});
		let category = await guild.channels.create({
			name: 'Prison',
			type: ChannelType.GuildCategory,
			position: 1,
			permissionOverwrites: [{
				id: guild.id,
				deny: [PermissionsBitField.Flags.ViewChannel]
			}, {
				id: prison.id,
				allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
			}]
		});
		let chann = await guild.channels.create({
			name: 'prison',
			type: ChannelType.GuildText,
			parent: category.id,
			position: 1,
			permissionOverwrites: [{
				id: guild.id,
				deny: [PermissionsBitField.Flags.ViewChannel]
			}, {
				id: prison.id,
				allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
			}]
		});
		guild.channels.cache.forEach(x => {
			if (x.id === chann.id) x.permissionOverwrites.edit(prison, { ViewChannel: true });
			else if (!x.isThread()) x.permissionOverwrites.edit(prison, { ViewChannel: false });
		})
		con.query("UPDATE servers SET prison_id = ?, prison_role_id = ?, prison_category_id = ? WHERE guild_id = ?", [chann.id, prison.id, category.id, req.body.guild_id], (err) => { if (err) console.log(err) });
	} catch (e) {
		req.session.errors = ["Une erreur est survenue lors de la création de la prison"];
		return res.redirect('servers/' + req.body.guild_id + '/jail');
	}
	return res.status(200).send({
		status : 'success',
		message : 'La prison a bien été créée'
	});
});

router.post('/jail/delete', async (req, res) => {
	const client = index.getClient();
	const con = index.getDB();
	try {
		let [prison] = await con.promise().query(`SELECT prison_id, prison_role_id, prison_category_id FROM servers WHERE guild_id = '${req.body.guild_id}'`);
		prison = prison[0];
		const guild = client.guilds.cache.get(req.body.guild_id);
		if (!guild) {
			res.session.errors = ['Serveur introuvable'];
			return res.redirect('/servers/' + req.body.guild_id + '/jail');
		}
		let channel = guild.channels.cache.find(x => x.id === prison.prison_id)
		if (channel) channel.delete();
		let role = guild.roles.cache.find(x => x.id === prison.prison_role_id);
		if (role) role.delete()
		let category = guild.channels.cache.find(x => x.id === prison.prison_category_id);
		if (category) category.delete()
		con.query("UPDATE servers SET prison_id = ?, prison_role_id = ?, prison_category_id = ?, prison_admin_id = ? WHERE guild_id = ?", [null, null, null, null, req.body.guild_id], (err) => { if (err) console.log(err) });
	} catch (e) {
		req.session.errors = ["Une erreur est survenue lors de la suppression de la prison"];
		return res.redirect('servers/' + req.body.guild_id + '/jail');
	}
	return res.status(200).send('La prison a bien été supprimée');
});

module.exports = router;