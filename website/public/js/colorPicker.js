const colors = document.querySelectorAll('input[name="couleur_hexa"]');

for (var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('input', changeColor, false);
}

function changeColor(e) {
    if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(e.target.value)) {
        let view = e.target.parentElement.parentElement.querySelector('.color-picker-view')
        let color = e.target.value;
		if (e.target.value.startsWith('#')) color = e.target.value.slice(1)
        view.style.borderColor = `#${color}`
        view.style.color = `#${color}`
    }
}