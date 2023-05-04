const express = require('express');
const { validateGuild } = require('../modules/middleware');
const sessions = require('../modules/sessions');

const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('dashboard/index.twig', {
        page: 'dashboard'
    });
});

router.get('/dashboard/profil', async (req, res) => {
	let inputs = {};
    let date = await sessions.getBirthdate(res.locals.user._id);
    let day = date ? date.split('/')[0] : null;
    let month = date ? date.split('/')[1] : null;
    let profile = await sessions.getProfile(res.locals.user._id);
	profile.birthday = date ? true : false;
	profile.profile = profile ? true : false;
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
		inputs: inputs
    });
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