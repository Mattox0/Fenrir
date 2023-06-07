const create_jail = document.querySelector('#create-jail');
const delete_jail = document.querySelector('#delete-jail');

create_jail.addEventListener('click', (e) => {
	if (create_jail.classList.contains('disabled')) return;
	create_jail.querySelector('.message').style.display = 'none';
	create_jail.querySelector('.loader_discord').style.display = 'flex';
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
			window.location.href = '/servers/' + data.guild_id + '/jail';
		})
});

delete_jail.addEventListener('click', (e) => {
	if (delete_jail.classList.contains('disabled')) return;
	delete_jail.querySelector('.message').style.display = 'none';
	delete_jail.querySelector('.loader_discord').style.display = 'flex';
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
		.then(res => res.json())
		.then(data => {
			window.location.href = '/servers/' + data.guild_id + '/jail';
		})
});