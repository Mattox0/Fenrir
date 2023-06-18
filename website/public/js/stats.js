
const inputsVoice = document.querySelectorAll('input[type="text"]');
const checkboxVoice = document.querySelectorAll('label.switch-normal');

inputsVoice.forEach(element => {
	element.addEventListener('input', inputText);
});

checkboxVoice.forEach(element => {
	element.addEventListener('click', openLabel);
});

function inputText(e) {
	const element = e.target;
	const text = document.querySelector(`p[voice-id="${element.id}"]`);
	const checkbox = document.querySelector(`input[type="checkbox"][name="check_${element.name}"]`);
	if (!text) return;
	let value = element.value.replace('{nb}', text.getAttribute('nb'));
	if (value == '') text.innerHTML = element.placeholder.replace('{nb}', text.getAttribute('nb'));
	else text.innerHTML = `${value}`;
	if (value != '') {
		checkbox.checked = true;
		let slider = checkbox.parentNode.querySelector('.slider');
		slider.classList.add('active');
	} else {
		checkbox.checked = false;
		let slider = checkbox.parentNode.querySelector('.slider');
		slider.classList.remove('active');
	}
}

function openLabel(e) {
	if (e.target.nodeName === 'INPUT') return
	let element;
	if (e.target.nodeName === 'LABEL') {
		element = e.target.querySelector('.slider')
	} else if (e.target.nodeName === 'DIV') {
		element = e.target
	}
	element.classList.toggle('active')
}