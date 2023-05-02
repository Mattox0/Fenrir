const guilds = document.querySelectorAll('.dash-icon');

const hovered = async (e) => {
    let element;
    if (!e.target.nextElementSibling) {
        element = e.target.parentNode.nextElementSibling
    } else {
        element = e.target.nextElementSibling
    }
    element.classList.remove('hidden')
    element.children[0].classList.add('active')
    element.children[0].style.transform = `translate3d(75px, ${e.target.getBoundingClientRect().top + 5}px, 0px)`
}

const unhovered = (e) => {
    let element;
    if (!e.target.nextElementSibling) {
        element = e.target.parentNode.nextElementSibling
    } else {
        element = e.target.nextElementSibling
    }
    element.classList.add('hidden')
    element.children[0].classList.remove('active')
    element.children[0].style.transform = ``
}

addEventListenerList(guilds, 'mouseover', hovered)
addEventListenerList(guilds, 'mouseout', unhovered)

function addEventListenerList(list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}
