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
			return res.status(202).send({
				status : 'error',
				guild_id : req.body.guild_id
			});
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
		req.session.errors = ["Une erreur est survenue"];
		return res.status(202).send({
			status : 'error',
			guild_id : req.body.guild_id
		});
	}
	req.session.success = ["La prison a bien été créée"];
	return res.status(200).send({
		status : 'success',
		guild_id : req.body.guild_id
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
			return res.status(202).send({
				status : 'error',
				guild_id : req.body.guild_id
			});
		}
		let channel = guild.channels.cache.find(x => x.id === prison.prison_id)
		if (channel) channel.delete();
		let role = guild.roles.cache.find(x => x.id === prison.prison_role_id);
		if (role) role.delete()
		let category = guild.channels.cache.find(x => x.id === prison.prison_category_id);
		if (category) category.delete()
		con.query("UPDATE servers SET prison_id = ?, prison_role_id = ?, prison_category_id = ?, prison_admin_id = ? WHERE guild_id = ?", [null, null, null, null, req.body.guild_id], (err) => { if (err) console.log(err) });
	} catch (e) {
		req.session.errors = ["Une erreur est survenue"];
		return res.status(202).send({
			status : 'error',
			guild_id : req.body.guild_id
		});
	}
	req.session.success = ["La prison a bien été supprimée"];
	return res.status(200).send({
		status : 'success',
		guild_id : req.body.guild_id
	});
});

router.post('/room/create', async (req, res) => {
	const client = index.getClient();
	const con = index.getDB();
	try {
		const guild = client.guilds.cache.get(req.body.guild_id);
		if (!guild) {
			res.session.errors = ['Serveur introuvable'];
			return res.status(202).send({
				status : 'error',
				guild_id : req.body.guild_id
			});
		}
		let category = await guild.channels.create({
			name: 'Salons privés',
			type: ChannelType.GuildCategory,
			permissionOverwrites: [{
				id: guild.id,
				allow: [PermissionsBitField.Flags.ViewChannel]
			}]
		});
		let room = await guild.channels.create({
			name: "➕ Créer votre salon",
			type: ChannelType.GuildVoice,
			parent: category.id,
			permissionOverwrites: [{
				id: guild.id,
				allow: [PermissionsBitField.Flags.ViewChannel]
			}]
		});
		console.log("oui")
		con.query("UPDATE servers SET privateroom_category_id = ?, privateroom_channel_id = ? WHERE guild_id = ?", [category.id, room.id, req.body.guild_id], (err) => { if (err) console.log(err) });
	} catch (e) {
		req.session.errors = ["Une erreur est survenue"];
		return res.status(202).send({
			status : 'error',
			guild_id : req.body.guild_id
		});
	}
	req.session.success = ["Le système vocal a bien été créée"];
	return res.status(200).send({
		status : 'success',
		guild_id : req.body.guild_id
	});
});

router.post('/room/delete', async (req, res) => {
	const client = index.getClient();
	const con = index.getDB();
	try {
		let [room] = await con.promise().query(`SELECT privateroom_category_id, privateroom_channel_id FROM servers WHERE guild_id = '${req.body.guild_id}'`);
		room = room[0];
		const guild = client.guilds.cache.get(req.body.guild_id);
		if (!guild) {
			res.session.errors = ['Serveur introuvable'];
			return res.status(202).send({
				status : 'error',
				guild_id : req.body.guild_id
			});
		}
		let channel = guild.channels.cache.find(x => x.id === room.privateroom_channel_id)
		if (channel) channel.delete();
		let category = guild.channels.cache.find(x => x.id === room.privateroom_category_id);
		if (category) category.delete();
		con.query("UPDATE servers SET privateroom_category_id = ?, privateroom_channel_id = ? WHERE guild_id = ?", [null, null, req.body.guild_id], (err) => { if (err) console.log(err) });
	} catch (e) {
		req.session.errors = ["Une erreur est survenue"];
		return res.status(202).send({
			status : 'error',
			guild_id : req.body.guild_id
		});
	}
	req.session.success = ["Le système vocal a bien été supprimée"];
	return res.status(200).send({
		status : 'success',
		guild_id : req.body.guild_id
	});
});

module.exports = router;