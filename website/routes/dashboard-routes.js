const express = require('express');
const { validateGuild } = require('../modules/middleware');
const sessions = require('../modules/sessions');
const birthdaySession = require('../modules/sessions/birthday');
const profileSession = require('../modules/sessions/profile');

const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('dashboard/index.twig', {
        page: 'dashboard'
    });
});

router.get('/dashboard/profil', async (req, res) => {
	let errors = req.session.errors || [];
	req.session.errors = null;
	let inputs = {};
    let date = await birthdaySession.getBirthdate(res.locals.user._id);
    let day = date ? date.split('/')[0] : null;
    let month = date ? date.split('/')[1] : null;
    let profile = await profileSession.getProfile(res.locals.user._id) || {description: null,image: null,footer: null, couleur_hexa: null, film: null, musique: null, repas: null, adjectifs: null, pseudo: null, likes: JSON.stringify({likes: []})}
	profile.birthday = date ? true : false;
	profile.profile = profile.user_id ? true : false;
	profile.day = day;
	profile.month = month;
	ids = [284186951846,392720167665,637210305697,882231459708,707819299871,352879152078,407308911748,921070860283,520141303837,148211919620,666234912102,584720150435,216374929769]
	let count = 0;
	Object.keys(profile).forEach(key => {
		if (key !== 'id' && key !== 'user_id' && key !== 'likes') inputs[key] = ids[count];
		else count -= 1;
		count++
	})
    let profile_likes = JSON.parse(profile.likes).likes;
    res.render('dashboard/profil.twig', {
        page: 'profil',
        date: date,
        day: day,
        month: month,
        profile: profile,
        profile_likes: profile_likes.length,
		inputs: inputs,
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
	let guild = await sessions.guild(req.params.id);
	if (birthday) {
		birthday.anniv_channel_id = birthday.anniv_channel_id ? await sessions.channel(guild, birthday.anniv_channel_id) : null;
		birthday.anniv_role_id = birthday.anniv_role_id ? await sessions.role(guild, birthday.anniv_role_id) : null;
	}
	res.render('dashboard/birthday.twig', {
		savedGuild: guild,
		page: 'birthday',
		birthday: birthday,
	})
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