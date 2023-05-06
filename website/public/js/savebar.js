const myDataElement = document.getElementById('my-data');
const profile = JSON.parse(myDataElement.textContent);

const inputIds = document.getElementById('input-id');
const allInputs = JSON.parse(inputIds.textContent);

const inputs = document.querySelectorAll('input:not([type=submit]), textarea, select');

inputs.forEach(element => {
	element.addEventListener('change', inputOnChange);
	element.addEventListener('input', inputOnChange);
});

function inputOnChange(e) {
	const savebar = document.getElementById('savebar');
	if (inputAreChange()) {
		savebar.classList.remove('hidden');
		savebar.classList.remove('close');
		savebar.classList.add('open');
	} else {
		savebar.classList.remove('open');
		savebar.classList.add('close');
		setTimeout(() => {
			savebar.classList.add('hidden');
		}, 1000);
	}
}

function inputAreChange() {
	for (let [element, id] of Object.entries(allInputs)) {
		const input = document.getElementById(id);
		if (input.value !== profile[element] && input.checked !== profile[element] && input.value !== '') {
			return true;
		}
	}
	return false;
}

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
	window.location.reload();
});