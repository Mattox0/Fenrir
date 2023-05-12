const inputBirthday = document.getElementById('618247562175')

inputBirthday.addEventListener('input', (e) => {
	const embedElement = document.querySelector(`p[embedid="618247562175"]`);
	embedElement.innerHTML = e.target.value;
	if (e.target.value === '') embedElement.innerHTML = "Un message personalisé";
});