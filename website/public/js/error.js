const modalError = document.querySelector('i.fa-xmark');
const messageError = document.getElementById('message-error');
modalError.addEventListener('click', () => {
	while (messageError.firstChild) {
		messageError.removeChild(messageError.firstChild);
	}
	messageError.remove();
});