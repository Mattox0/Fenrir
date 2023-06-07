const create_jail = document.querySelector('#create-jail');
const delete_jail = document.querySelector('#delete-jail');

create_jail.addEventListener('click', (e) => {
	if (create_jail.classList.contains('disabled')) return;
	console.log(window.location.pathname.split('/')[2]);
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
});

delete_jail.addEventListener('click', (e) => {
	if (delete_jail.classList.contains('disabled')) return;
});