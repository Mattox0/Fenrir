const inputBirthday = document.getElementById('273774389')

inputBirthday.addEventListener('input', (e) => {
	const embedElement = document.querySelector(`p[embedid="273774389"]`);
	embedElement.innerHTML = e.target.value;
	if (e.target.value === '') embedElement.innerHTML = "Réagissez 📩 pour ouvrir un ticket !";
});

const create_ticket = document.querySelector('#create-ticket');
const delete_ticket = document.querySelector('#delete-ticket');

create_ticket.addEventListener('click', (e) => {
	if (create_ticket.classList.contains('disabled')) return;
	create_ticket.querySelector('.message').style.display = 'none';
	create_ticket.querySelector('.loader_discord').style.display = 'flex';
	fetch('/ticket/create', {
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
			window.location.href = '/servers/' + data.guild_id + '/ticket';
		})
});

delete_ticket.addEventListener('click', (e) => {
	if (delete_ticket.classList.contains('disabled')) return;
	delete_ticket.querySelector('.message').style.display = 'none';
	delete_ticket.querySelector('.loader_discord').style.display = 'flex';
	fetch('/ticket/delete', {
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
			window.location.href = '/servers/' + data.guild_id + '/ticket';
		})
});
