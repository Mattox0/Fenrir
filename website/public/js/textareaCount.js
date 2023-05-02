const textareas = document.querySelectorAll('textarea');

for (var i = 0; i < textareas.length; i++) {
    textareas[i].addEventListener('input', count, false);
}

function count(e) {
    let element = e.target
    let count = element.nextElementSibling.children[0]
    let length = element.value.length
    count.innerHTML = `${length}`
}