const inputs = document.querySelectorAll('input:not([type=submit]), textarea');

inputs.forEach(element => {
	element.addEventListener('change', inputOnChange);
	element.addEventListener('input', inputOnChange);
	// element.addEventListener('focus', inputOnChange);
	element.addEventListener('blur', inputOnChange);
});

function inputOnChange(e) {
	const savebar = document.getElementById('savebar');
	savebar.classList.remove('hidden');
	savebar.classList.remove('close');
	savebar.classList.add('open');
}

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
	window.location.reload();
});