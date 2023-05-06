const index = require('../../../index');

async function getProfile(id) {
	const con = index.getDB();
	let [profile] = await con.promise().query(`SELECT * FROM profile WHERE user_id = ${id}`)
	if (profile.length > 0) return profile[0];
	return null;
}

async function deleteProfile(id) {
	const con = index.getDB();
	await con.promise().query(`DELETE FROM profile WHERE user_id = ${id}`);
}

async function updateProfile(id, body) {
	const con = index.getDB();
	await con.promise().query(`INSERT INTO profile (user_id, description, image, footer, couleur_hexa, film, musique, repas, adjectifs, pseudo, likes) 
	VALUES ('${id}', ${body.description ? `'${body.description}'` : null}, ${body.image ? `'${body.image}'` : null},${body.footer ? `'${body.footer}'` : null},${body.couleur_hexa ? `'${body.couleur_hexa}'` : null},${body.film ? `'${body.film}'` : null},${body.musique ? `'${body.musique}'` : null},${body.repas ? `'${body.repas}'` : null},${body.adjectifs ? `'${body.adjectifs}'` : null},${body.pseudo ? `'${body.pseudo}'` : null}, '${JSON.stringify({likes:[]})}') 
	ON DUPLICATE KEY UPDATE 
		description = IF(VALUES(description) IS NULL, description, VALUES(description)),
		image = IF(VALUES(image) IS NULL, image, VALUES(image)),
		footer = IF(VALUES(footer) IS NULL, footer, VALUES(footer)),
		couleur_hexa = IF(VALUES(couleur_hexa) IS NULL, couleur_hexa, VALUES(couleur_hexa)),
		film = IF(VALUES(film) IS NULL, film, VALUES(film)),
		musique = IF(VALUES(musique) IS NULL, musique, VALUES(musique)),
		repas = IF(VALUES(repas) IS NULL, repas, VALUES(repas)),
		adjectifs = IF(VALUES(adjectifs) IS NULL, adjectifs, VALUES(adjectifs)),
		pseudo = IF(VALUES(pseudo) IS NULL, pseudo, VALUES(pseudo)),
		likes = IF(VALUES(likes) IS NULL, likes, VALUES(likes))
	`)
}

module.exports.getProfile = getProfile;
module.exports.deleteProfile = deleteProfile;
module.exports.updateProfile = updateProfile;