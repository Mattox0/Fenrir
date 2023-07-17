const inputBirthday = document.getElementById('273774389')

inputBirthday.addEventListener('input', (e) => {
	const embedElement = document.querySelector(`p[embedid="273774389"]`);
	embedElement.innerHTML = e.target.value;
	if (e.target.value === '') embedElement.innerHTML = "Réagissez 📩 pour ouvrir un ticket !";
});