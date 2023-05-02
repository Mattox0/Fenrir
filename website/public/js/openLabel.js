const checkboxes = document.querySelectorAll('label.switch-normal');

for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('click', open, false);
}

function open(e) {
    if (e.target.nodeName === 'INPUT') return
    let element;
    if (e.target.nodeName === 'LABEL') {
        element = e.target.children[0]
        nextElement = e.target.parentNode.nextElementSibling
    } else if (e.target.nodeName === 'DIV') {
        element = e.target
        nextElement = e.target.parentNode.parentNode.nextElementSibling
    }
    element.classList.toggle('active')
    console.log(nextElement)
    if (nextElement.style.height == '0px') {
        nextElement.style.height = `${nextElement.children[0].offsetHeight}px`
        nextElement.style.overflow = `hidden`
        setTimeout(() => {
            nextElement.style.height = `auto`
            nextElement.style.overflow = `visible`
        }, 500)
    } else {
        nextElement.style.height = `${nextElement.children[0].offsetHeight}px`
        nextElement.style.overflow = `hidden`
        setTimeout(() => {
            nextElement.style.height = '0px'
            nextElement.style.overflow = `hidden`
        }, 10)
    }
}