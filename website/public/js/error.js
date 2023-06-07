const modalError = document.querySelectorAll('i.fa-xmark');
const messageError = document.getElementById('message-error');
const messageSuccess = document.getElementById('message-success');

modalError.forEach((i) => {
	i.addEventListener('click', () => {
		while (messageError.firstChild) {
			messageError.removeChild(messageError.firstChild);
		}
		while (messageSuccess.firstChild) {
			messageSuccess.removeChild(messageSuccess.firstChild);
		}
		messageError.remove();
		messageSuccess.remove();
	});
});