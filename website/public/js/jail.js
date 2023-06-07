const create_jail = document.querySelector('#create-jail');
const delete_jail = document.querySelector('#delete-jail');

create_jail.addEventListener('click', (e) => {
	if (create_jail.classList.contains('disabled')) return;
	// create_jail.querySelector('')
	// ! AFFICHER LES POINTS 
	fetch('/jail/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			guild_id: window.location.pathname.split('/')[2]
		}),
	})
	.then(res => res.json())
	.then(data => {
		if (data.status === 'success') {
			create_jail.classList.add('disabled');
			delete_jail.classList.remove('disabled');
			req.session.success = [data.message];
			return res.redirect('/servers/' + req.body.guild_id + '/jail');
		} else {
			req.session.errors = [data.message];
			return res.redirect('/servers/' + req.body.guild_id + '/jail');
		}
	})
	.catch(err => console.log("ERR => ", err));
});

delete_jail.addEventListener('click', (e) => {
	if (delete_jail.classList.contains('disabled')) return;
	fetch('/jail/delete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			guild_id: window.location.pathname.split('/')[2]
		}),
	})
});