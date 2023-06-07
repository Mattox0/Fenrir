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
	req.session.success = ["La prison a bien été créée"];
	return res.redirect('servers/' + req.body.guild_id + '/jail');
});

module.exports = router;