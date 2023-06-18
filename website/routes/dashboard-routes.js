const express = require('express');
const { validateGuild } = require('../modules/middleware');
const sessions = require('../modules/sessions');
const birthdaySession = require('../modules/sessions/birthday');
const profileSession = require('../modules/sessions/profile');
const logsSession = require('../modules/sessions/logs');
const jailSession = require('../modules/sessions/jail');
const roomSession = require('../modules/sessions/room');
const statsSession = require('../modules/sessions/stats');

const router = express.Router();

router.get('/dashboard', (req, res) => {
	res.render('dashboard/index.twig', {
		page: 'dashboard'
	});
});

router.get('/dashboard/profil', async (req, res) => {
	let errors = req.session.errors || [];
	req.session.errors = null;
	let date = await birthdaySession.getBirthdate(res.locals.user._id);
	let day = date ? date.split('/')[0] : null;
	let month = date ? date.split('/')[1] : null;
	let profile = await profileSession.getProfile(res.locals.user._id) || { description: null, image: null, footer: null, couleur_hexa: null, film: null, musique: null, repas: null, adjectifs: null, pseudo: null, likes: JSON.stringify({ likes: [] }) }
	profile.birthday = date ? true : false;
	profile.profile = profile.user_id ? true : false;
	profile.day = day;
	profile.month = month;
	let profile_likes = JSON.parse(profile.likes).likes;
	res.render('dashboard/profil.twig', {
		page: 'profil',
		date: date,
		day: day,
		month: month,
		profile: profile,
		profile_likes: profile_likes.length,
		errors: errors
	});
});

router.post('/dashboard/profil', async (req, res) => {
	if (!req.body.birthday) await birthdaySession.deleteBirthday(res.locals.user._id);
	else {
		if (!await birthdaySession.isValidBirthday(req.body.day, req.body.month, res.locals.user._id)) {
			req.session.errors = ['Merci de rentrer une date valide'];
			return res.redirect('/dashboard/profil');
		}
		if (req.body.day && req.body.month) await birthdaySession.updateBirthday(res.locals.user._id, req.body.day, req.body.month);
	}
	if (!req.body.profile) await profileSession.deleteProfile(res.locals.user._id);
	else await profileSession.updateProfile(res.locals.user._id, req.body);
	res.redirect('/dashboard/profil');
});

router.get('/servers/:id/birthday', validateGuild, async (req, res) => {
	let birthday = await birthdaySession.getServerBirthday(req.params.id);
	let errors = req.session.errors || [];
	req.session.errors = null;
	let guild = await sessions.guild(req.params.id);
	birthday.anniv_channel_id = birthday.anniv_channel_id ? await sessions.channel(guild, birthday.anniv_channel_id) : null;
	birthday.anniv_role_id = birthday.anniv_role_id ? await sessions.role(guild, birthday.anniv_role_id) : null;
	let channels = await sessions.channels(guild);
	channels = channels.filter(channel => channel.type === 0);
	channels = await Promise.all(channels.map(async channel => await sessions.channelWithParent(guild, channel)));
	let roles = await sessions.roles(guild);
	roles = await Promise.all(roles.map(async role => await sessions.roleWithColor(role)));
	hours = await birthdaySession.getHours();
	res.render('dashboard/birthday.twig', {
		savedGuild: guild,
		page: 'birthday',
		birthday: birthday,
		channels: channels,
		roles: roles,
		hours: hours,
		errors: errors
	})
});

router.post('/servers/:id/birthday', validateGuild, async (req, res) => {
	if (!req.body.birthday) await birthdaySession.deleteGuildBirthday(req.params.id);
	else {
		if (!await birthdaySession.isValidGuildBirthday(req.body, await sessions.guild(req.params.id))) {
			req.session.errors = ['Merci de rentrer toutes les informations nécessaires'];
			return res.redirect(`/servers/${req.params.id}/birthday`);
		}
		await birthdaySession.updateGuildBirthday(req.body, req.params.id);
	}
	res.redirect(`/servers/${req.params.id}/birthday`);
})

router.get('/servers/:id/logs', validateGuild, async (req, res) => {
	const guild = await sessions.guild(req.params.id);
	let errors = req.session.errors || [];
	req.session.errors = null;
	let logs = await logsSession.getLogs(req.params.id);
	if (logs) logs.logs_id = logs.logs_id ? await sessions.channel(guild, logs.logs_id) : null;
	let channels = await sessions.channels(guild);
	channels = channels.filter(channel => channel.type === 0);
	channels = await Promise.all(channels.map(async channel => await sessions.channelWithParent(guild, channel)));
	res.render('dashboard/logs.twig', {
		savedGuild: guild,
		page: 'logs',
		logs: logs,
		channels: channels,
		errors: errors
	});
});

router.post('/servers/:id/logs', validateGuild, async (req, res) => {
	if (!req.body.logs) await logsSession.deleteLogs(req.params.id);
	else {
		if (!await logsSession.isValidLogs(req.body, await sessions.guild(req.params.id))) {
			req.session.errors = ['Merci de rentrer toutes les informations nécessaires'];
			return res.redirect(`/servers/${req.params.id}/logs`);
		}
		await logsSession.updateLogs(req.body, req.params.id);
	}
	res.redirect(`/servers/${req.params.id}/logs`);
});

router.get('/servers/:id/jail', validateGuild, async (req, res) => {
	const guild = await sessions.guild(req.params.id);
	let errors = req.session.errors || [];
	req.session.errors = null;
	let success = req.session.success || [];
	req.session.success = null;
	let jail = await jailSession.getJail(req.params.id);
	if (jail) {
		jail.prison_id = jail.prison_id ? await sessions.channel(guild, jail.prison_id) ? await sessions.channel(guild, jail.prison_id) : null : null;
		jail.prison_role_id = jail.prison_role_id ? await sessions.role(guild, jail.prison_role_id) ? await sessions.role(guild, jail.prison_role_id) : null : null;
		jail.prison_category_id = jail.prison_category_id ? await sessions.channel(guild, jail.prison_category_id) ? await sessions.channel(guild, jail.prison_category_id) : null : null;
		jail.prison_admin_id = jail.prison_admin_id ? await sessions.role(guild, jail.prison_admin_id) ? await sessions.role(guild, jail.prison_admin_id) : null : null;
	}
	let roles = await sessions.roles(guild);
	roles = await Promise.all(roles.map(async role => await sessions.roleWithColor(role)));
	res.render('dashboard/jail.twig', {
		savedGuild: guild,
		page: 'jail',
		jail: jail,
		roles: roles,
		errors: errors,
		success: success
	});
});

router.post('/servers/:id/jail', validateGuild, async (req, res) => {
	if (!req.body.jail) await jailSession.deleteJail(req.params.id);
	else {
		if (!await jailSession.isValidJail(req.body, await sessions.guild(req.params.id))) {
			req.session.errors = ['Merci de rentrer toutes les informations nécessaires'];
			return res.redirect(`/servers/${req.params.id}/jail`);
		}
		await jailSession.updateJail(req.body, req.params.id);
	}
	res.redirect(`/servers/${req.params.id}/jail`);
});

router.get('/servers/:id/room', validateGuild, async (req, res) => {
	const guild = await sessions.guild(req.params.id);
	let errors = req.session.errors || [];
	req.session.errors = null;
	let success = req.session.success || [];
	req.session.success = null;
	let channels = await sessions.channels(guild);
	channels = channels.filter(channel => channel.type === 2);
	channels = await Promise.all(channels.map(async channel => await sessions.channelWithParent(guild, channel)));
	let categories = await sessions.categories(guild);
	let room = await roomSession.getRoom(req.params.id);
	if (room) {
		room.privateroom_channel_id = room.privateroom_channel_id ? await sessions.channel(guild, room.privateroom_channel_id) ? await sessions.channel(guild, room.privateroom_channel_id) : null : null;
		room.privateroom_category_id = room.privateroom_category_id ? await sessions.channel(guild, room.privateroom_category_id) ? await sessions.channel(guild, room.privateroom_category_id) : null : null;
	}
	res.render('dashboard/room.twig', {
		savedGuild: guild,
		page: 'room',
		voices: channels,
		room: room,
		categories: categories,
		errors: errors,
		success: success
	});
});

router.post('/servers/:id/room', validateGuild, async (req, res) => {
	if (!await roomSession.validRoom(req.body, await sessions.guild(req.params.id))) {
		req.session.errors = ['Merci de rentrer toutes les informations nécessaires'];
		return res.redirect(`/servers/${req.params.id}/room`);
	}
	await roomSession.updateRoom(req.body, req.params.id);
	res.redirect(`/servers/${req.params.id}/room`);
});

router.get('/servers/:id/stats', validateGuild, async (req, res) => {
	const guild = await sessions.guild(req.params.id);
	let errors = req.session.errors || [];
	req.session.errors = null;
	let stats = await statsSession.getStat(req.params.id);
	if (stats) {
		stats.stats_id = stats.stats_id ? await sessions.channel(guild, stats.stats_id) ? await sessions.channel(guild, stats.stats_id) : null : null;
		stats.stats_bot_id = stats.stats_bot_id ? await sessions.channel(guild, stats.stats_bot_id) ? await sessions.channel(guild, stats.stats_bot_id) : null : null;
		stats.stats_online_id = stats.stats_online_id ? await sessions.channel(guild, stats.stats_online_id) ? await sessions.channel(guild, stats.stats_online_id) : null : null;
		stats.all_members = await sessions.allMembers(guild);
		stats.online_members = await sessions.onlineMembers(guild);
		stats.bot_members = await sessions.botMembers(guild);
	}
	res.render('dashboard/stats.twig', {
		savedGuild: guild,
		page: 'stats',
		stats: stats,
		errors: errors
	});
});

router.post('/servers/:id/stats', validateGuild, async (req, res) => {
	console.log(req.body);
	if (!await statsSession.validStats(req.body)) {
		req.session.errors = ['Vous avez oublié de mettre {nb}'];
		return res.redirect(`/servers/${req.params.id}/stats`);
	}
	await statsSession.updateStats(req.body, await sessions.guild(req.params.id));
	res.redirect(`/servers/${req.params.id}/stats`);
});

router.get('/servers/:id', validateGuild, async (req, res) => {
	res.render('dashboard/show.twig', {
		savedGuild: await sessions.guild(req.params.id),
		page: req.params.id
	})
});


module.exports = router;

// Imgur Client ID : 9ab383f99544b3e
// Imgur Client secret : 0f9a2f95260a8365db418e18c44f3bc66d45b430

// Authorization: Client-ID YOUR_CLIENT_ID