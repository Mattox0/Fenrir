const textareas = document.querySelectorAll('textarea, input[type="text"]');

for (var i = 0; i < textareas.length; i++) {
    textareas[i].addEventListener('input', count, false);
}

function count(e) {
    const element = e.target;
	const label = document.querySelector(`label[for='${element.id}']`);
	if (!label) return;
	const span = label.querySelector('span');
	const current = element.value.length;
	span.innerHTML = `${current}`;
}