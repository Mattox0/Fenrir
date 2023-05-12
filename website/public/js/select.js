const selects = document.querySelectorAll('input[type=text].select');
const selectElements = document.querySelectorAll('.select-elements > .element');

selects.forEach(select => {
	select.addEventListener('focus', onSelect);
	select.addEventListener('blur', onUnselect);
});

selectElements.forEach(selectElement => {
	selectElement.addEventListener('click', onSelectElement);
});

function onSelect(e) {
	let parent = e.target.parentNode.parentNode;
	parent.classList.add('active');
	let list = parent.querySelector('.select-elements');
	list.style.display = 'block';
}

function onUnselect(e) {
	let parent = e.target.parentNode.parentNode;
	parent.classList.remove('active');
	setTimeout(() => {
		let list = parent.querySelector('.select-elements');
		list.style.display = 'none';
	}, 150);
}

function onSelectElement(e) {
	let selector = e.target
	let element = e.target
	while (!selector.classList.contains('selector')) {
		selector = selector.parentNode;
	}
	let inputSelector = selector.querySelector('.select-element').querySelector('input[type=text]')
	let inputHidden = selector.querySelector('.select-element').querySelector('input[type=hidden]')
	while (!element.classList.contains('element')) {
		element = element.parentNode;
	}
	let id = element.firstElementChild.id;
	let name = element.firstElementChild.querySelector('div').innerHTML;
	selector.firstElementChild.classList.add('active');
	if (inputSelector.classList.contains('not-hidden')) {
		inputSelector.value = name;
	} else {
		inputHidden.value = id;
		inputSelector.placeholder = name;
	}
}