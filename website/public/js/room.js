const create_room = document.querySelector('#create-room');
const delete_room = document.querySelector('#delete-room');

create_room.addEventListener('click', (e) => {
	if (create_room.classList.contains('disabled')) return;
	create_room.querySelector('.message').style.display = 'none';
	create_room.querySelector('.loader_discord').style.display = 'flex';
	console.log('ok')
	fetch('/room/create', {
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
			window.location.href = '/servers/' + data.guild_id + '/room';
		})
});

delete_room.addEventListener('click', (e) => {
	if (delete_room.classList.contains('disabled')) return;
	delete_room.querySelector('.message').style.display = 'none';
	delete_room.querySelector('.loader_discord').style.display = 'flex';
	fetch('/room/delete', {
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
			window.location.href = '/servers/' + data.guild_id + '/room';
		})
});